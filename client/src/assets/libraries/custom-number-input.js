console.log('custom number input loaded')
const { defineComponent, ref, computed, watch } = Vue;

const defaultOptions = {
    prefix: '',
    suffix: '',
    separator: ',',
    decimal: '.',
    precision: 2,
    minimumFractionDigits: null,
    prefill: true,
    reverseFill: false,
    min: null,
    max: null,
    nullValue: '',
    placeholder: '',
    class: '',
}
const MINUS = '-'

/*************************** generic functions ******************************** */
const cloneDeep = (data) => JSON.parse(JSON.stringify(data))
const between = (min, n, max) => Math.max(min, Math.min(n, max))
const fixed = (precision) => between(0, precision, 20)

const InputEvent = (event) => {
    return new CustomEvent(event, {
        bubbles: true,
        cancelable: true,
        detail: { facade: true }
    })
}

const getInputElement = (el) => {
    const inputElement = el instanceof HTMLInputElement ? el : el.querySelector < HTMLInputElement > ('input')

    /* istanbul ignore next */
    if (!inputElement) {
        throw new Error('number directive requires an input element')
    }

    return inputElement
}

function updateCursor(el, position) {
    const setSelectionRange = () => {
        el.setSelectionRange(position, position)
    }
    setSelectionRange()
    // Android Fix
    setTimeout(setSelectionRange, 1)
}

const updateValue = (el, vnode, { emit = true, force = false, clean = false } = {}) => {
    const { options, oldValue } = el
    const { reverseFill, max, min } = options
    const currentValue = vnode?.props?.value || el.value

    if (force || oldValue !== currentValue) {
        const number = new NumberFormat(options).clean(clean && !reverseFill)
        let masked = number.format(currentValue)
        let unmasked = number.clean(!reverseFill).unformat(currentValue)

        // check value with in range max and min value
        if (clean) {
            if (Number(max) === max && Number(unmasked) > max) {
                masked = number.format(max)
                unmasked = max.toString()
            } else if (Number(min) === min && Number(unmasked) < min) {
                masked = number.format(min)
                unmasked = min.toString()
            }
        }
        el.oldValue = masked
        el.unmasked = unmasked

        // safari makes the cursor jump to the end if el.value gets assign even if to the same value
        if (el.value !== masked) {
            el.value = masked
        }

        // this part needs to be outside the above IF statement for vuetify in firefox
        // drawback is that we endup with two's input events in firefox
        return emit && el.dispatchEvent(InputEvent('input'))
    }
}

const inputHandler = (event) => {
    const { target, detail } = event

    // We dont need to run this method on the event we emit (prevent event loop)
    if (detail?.facade) return false

    // since we will be emitting our own custom input event
    // we can stop propagation of this native event
    event.stopPropagation()

    let positionFromEnd = target.value.length
    const { oldValue, options } = target
    if (target.selectionEnd) {
        positionFromEnd = target.value.length - target.selectionEnd
    }

    updateValue(target, null, { clean: !options.precision, emit: false })

    // updated cursor position
    if (options.suffix) {
        positionFromEnd = Math.max(positionFromEnd, options.suffix.length)
    }
    positionFromEnd = target.value.length - positionFromEnd
    if (options.prefix) {
        positionFromEnd = Math.max(positionFromEnd, options.prefix.length)
    }
    updateCursor(target, positionFromEnd)

    if (oldValue !== target.value) {
        target.dispatchEvent(InputEvent('input'))
    }
}

const blurHandler = (event) => {
    const { target } = event

    const { oldValue } = target

    updateValue(target, null, { force: true, clean: true, emit: false })

    if (oldValue !== target.value) {
        target.dispatchEvent(InputEvent('input'))
    }
}

const keydownHandler = (event, el) => {
    const { options } = el
    const { prefix, suffix, decimal, min, separator } = options
    const { key } = event
    const regExp = new RegExp(`${prefix}|${suffix}`, 'g')
    const newValue = el.value.replace(regExp, '')
    const canBeNegative = min === undefined || Number(min) < 0 || Number(min) !== min
    if (key === decimal) {
        if (newValue.includes(decimal)) {
            event.preventDefault()
        } else if (!newValue) {
            el.value = '0' + decimal
            // trigger input event
            el.dispatchEvent(new Event('input'))
        }
    } else if (key === MINUS && !canBeNegative) {
        event.preventDefault()
    } else if (key === 'Backspace') {
        // check current cursor position is after separator when backspace key down
        const selectionEnd = el.selectionEnd || 0
        const character = el.value.slice(selectionEnd - 1, selectionEnd)
        const replace = el.value.slice(selectionEnd - 2, selectionEnd)
        let positionFromEnd = el.value.length - selectionEnd
        if ([prefix, MINUS, separator].includes(character)) {
            event.preventDefault()
            if (character === separator) {
                el.value = el.value.replace(replace, '')
            } else {
                el.value = el.value.replace(new RegExp(`[${prefix}${MINUS}]`, 'g'), '')
            }
            positionFromEnd = Math.max(positionFromEnd, suffix.length)
            positionFromEnd = el.value.length - positionFromEnd
            positionFromEnd = Math.max(positionFromEnd, prefix.length)
            updateCursor(el, positionFromEnd)
            // trigger input event
            el.dispatchEvent(new Event('input'))
        }
    }
}

/**************************** number format ************************************ */
class NumberFormat {
    options
    input
    number
    isClean
    preSurRegExp
    numberRegExp
    cleanRegExp
    negativeRegExp

    constructor(config) {
        this.options = Object.assign(cloneDeep(defaultOptions), config)
        const { prefix, suffix, decimal, reverseFill } = this.options

        this.input = ''
        this.number = ''
        this.isClean = !reverseFill

        const escapedPrefix = prefix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')
        const escapedSuffix = suffix.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')

        this.preSurRegExp = new RegExp(`${escapedPrefix}|${escapedSuffix}`, 'g')
        this.numberRegExp = new RegExp(`[^0-9\\${decimal}]+`, 'gi')
        this.cleanRegExp = new RegExp('[^0-9]+', 'gi')
        this.negativeRegExp = new RegExp('[^0-9\\-]+', 'gi')
    }

    isNull() {
        return !this.numberOnly(this.isClean ? this.cleanRegExp : this.negativeRegExp)
    }

    clean(clean = false) {
        this.isClean = clean
        return this
    }

    sign() {
        if (this.input === null || this.input === undefined) return ''

        const hasMinus = this.input.toString().indexOf('-') >= 0
        if (this.isClean) return hasMinus && this.realNumber() > 0 ? '-' : ''

        return hasMinus ? '-' : ''
    }

    toFixed() {
        const exp = Math.pow(10, this.options.precision)
        const float = parseFloat(this.numberOnly(/\D+/g)) / exp || 0
        return float.toFixed(fixed(this.options.precision))
    }

    toNumber(str) {
        return Number(str)
    }

    numberOnly(regExp) {
        return this.input
            ?.toString()
            .replace(this.preSurRegExp, '')
            .replace(regExp || this.numberRegExp, '')
    }

    isNegative() {
        return this.sign() === '-'
    }

    numbers() {
        const { reverseFill, decimal } = this.options
        if (reverseFill) {
            this.number = this.toFixed().replace('.', decimal)
        } else if (typeof this.input === 'number') {
            this.number = this.parts(this.input.toString().replace('-', ''), '.').join(decimal)
        } else if (!isNaN(this.toNumber(this.input))) {
            this.number = this.parts(this.input.replace('-', ''), '.').join(decimal)
        } else {
            this.number = this.parts(this.numberOnly()).join(decimal)
        }
        return this.number
    }

    unformatNumber() {
        return this.numbers().toString().replace(this.options.decimal, '.')
    }

    realNumber() {
        return parseFloat(this.unformatNumber())
    }

    parts(num, separator) {
        const { precision, minimumFractionDigits, decimal } = this.options
        let parts = num.toString().split(separator || decimal)

        if (parts.length > 1) {
            parts[0] = this.toNumber(parts[0]) || 0
            parts[1] = parts.slice(1, parts.length).join('')
            parts = parts.slice(0, 2)
        }

        if (this.isClean) {
            const newNumber = this.toNumber(parts.join('.')).toFixed(precision)
            const cleanNumber = this.toNumber(newNumber)
            const minimumDigits = cleanNumber.toFixed(minimumFractionDigits)
            const hasMinFraction = minimumFractionDigits >= 0 && cleanNumber.toString().length < minimumDigits.length

            if (hasMinFraction) {
                parts = minimumDigits.toString().split('.')
            } else {
                parts = cleanNumber.toString().split('.')
            }
        }

        return parts.slice(0, 2)
    }

    addSeparator() {
        const { decimal, separator } = this.options
        const parts = this.numbers().split(decimal)
        parts[0] = parts[0].toString().replace(/(\d)(?=(?:\d{3})+\b)/gm, `$1${separator}`)
        return parts.join(decimal)
    }

    format(input) {
        this.input = input
        const { reverseFill, nullValue, prefix, suffix } = this.options
        if (this.isNull() && !reverseFill) {
            return nullValue
        }
        return this.sign() + prefix + this.addSeparator() + suffix
    }

    unformat(input) {
        this.input = input
        const { reverseFill, nullValue } = this.options
        const realNumber = this.realNumber()
        const unformatNumber = this.unformatNumber()
        if (this.isNull()) {
            return nullValue
        }
        if (reverseFill && realNumber === 0) {
            return nullValue
        }
        return this.sign() + unformatNumber
    }
}

/***************************** directives ************************************** */
const numberDirectives = {
    beforeMount: (el, { value, modifiers }, vnode) => {
        el = getInputElement(el)
        const options = Object.assign(cloneDeep(defaultOptions), value, modifiers)
        const { reverseFill, precision, decimal } = options
        el.options = options
        el.setAttribute('inputmode', 'numeric')
        if (reverseFill && el.value) {
            el.value = parseFloat(new NumberFormat({ ...options, reverseFill: false }).unformat(el.value)).toFixed(precision)
            if (vnode?.props?.value) {
                vnode.props.value = el.value
            }
        } else if (el.value && !isNaN(Number(el.value))) {
            el.value = el.value.replace('.', decimal)
        }
        // set initial value
        updateValue(el, vnode, { force: options.prefill, clean: true, emit: false })
    },

    mounted: (el) => {
        el = getInputElement(el)

        // prefer adding event listener to parent element to avoid Firefox bug which does not
        // execute `useCapture: true` event handlers before non-capturing event handlers
        const handlerOwner = el.parentElement || el

        // use anonymous event handler to avoid inadvertently removing masking for all inputs within a container
        const oninput = (e) => {
            if (e.target !== el) {
                return
            }
            inputHandler(e)
        }

        const onblur = (e) => {
            if (e.target !== el) {
                return
            }
            blurHandler(e)
        }

        // check decimal key and insert to current element
        // updated cursor position after format the value
        const onkeydown = (e) => {
            if (e.target !== el) {
                return
            }
            keydownHandler(e, el)
        }

        handlerOwner.addEventListener('input', oninput, true)
        handlerOwner.addEventListener('blur', onblur, true)
        handlerOwner.addEventListener('keydown', onkeydown, true)

        el.cleanup = () => {
            handlerOwner.removeEventListener('input', oninput, true)
            handlerOwner.removeEventListener('blur', onblur, true)
            handlerOwner.removeEventListener('keydown', onkeydown, true)
        }
    },

    updated: (el, { value, oldValue, modifiers }, vnode) => {
        el = getInputElement(el)
        if (value !== oldValue) {
            const options = el.options
            el.options = Object.assign(options, value, modifiers)
            updateValue(el, vnode, { force: true, clean: false, emit: false })
        } else {
            updateValue(el, vnode, { emit: false })
        }
    },

    unmounted: (el) => {
        getInputElement(el).cleanup()
    }
}

export default defineComponent({
    name: 'TheNumberInput',
    props: {
        value: {
            type: Number,
            required: false,
        },
        modelValue: {
            type: Number,
            required: false,
        },
        nullValue: {
            type: [Number, String],
            required: false,
            default: defaultOptions.nullValue
        },
        masked: Boolean,
        readonly: Boolean,
        disabled: Boolean,
        reverseFill: {
            type: Boolean,
            required: false,
            default: defaultOptions.reverseFill
        },
        prefill: {
            type: Boolean,
            required: false,
            default: defaultOptions.prefill
        },
        precision: {
            type: Number,
            required: false,
            default: () => defaultOptions.precision
        },
        minimumFractionDigits: {
            type: Number,
            required: false,
            default: () => defaultOptions.minimumFractionDigits
        },
        decimal: {
            type: String,
            required: false,
            default: () => defaultOptions.decimal
        },
        min: {
            type: Number,
            required: false,
            default: () => defaultOptions.min
        },
        max: {
            type: Number,
            default: () => defaultOptions.max
        },
        separator: {
            type: String,
            required: false,
            default: () => defaultOptions.separator
        },
        prefix: {
            type: String,
            required: false,
            default: () => defaultOptions.prefix
        },
        suffix: {
            type: String,
            required: false,
            default: () => defaultOptions.suffix
        },
        placeholder: {
            type: String,
            required: false,
            default: () => defaultOptions.placeholder
        },
        class: {
            type: String,
            required: false,
            default: () => defaultOptions.class
        },
        input: {
            type: Function,
            required: false,
        },
        change: {
            type: Function,
            required: false,
        }
    },
    emits: ['blur', 'change', 'input', 'update:model-value', 'input:model-value'],
    directives: { number: numberDirectives },
    setup(props, { emit }) {
        const maskedValue = ref(props.value === undefined ? props.modelValue : props.value)
        const canEmit = ref(false)
        const unmaskedValue = ref('')
        const config = computed(() => ({ ...props }))
        const formatNumber = new NumberFormat(config.value)

        const emittedValue = computed(() => {
            if (props.masked) {
                return formatNumber.format(maskedValue.value)
            }
            return parseFloat(unmaskedValue.value)
        })

        const input = (event) => {
            const { target } = event
            maskedValue.value = target.value
            unmaskedValue.value = target.unmasked
            canEmit.value = true
            if (props.input) props.input(isNaN(emittedValue.value) ? null : emittedValue.value)
            emit('input:model-value', 11)
        }

        const change = () => {
            if (props.change) props.change(isNaN(emittedValue.value) ? null : emittedValue.value)
            emit('update:model-value', emittedValue.value)
        }

        const blur = () => {
            if (canEmit.value && emittedValue.value !== (props.value === undefined ? props.modelValue : props.value)) {
                change()
            }
        }

        watch(() => props.modelValue, (newValue) => {
            const number = formatNumber.format(newValue)
            if (number !== maskedValue.value) {
                maskedValue.value = number
            }
        })

        watch(() => props.value, (newValue) => {
            const number = formatNumber.format(newValue)
            if (number !== maskedValue.value) {
                maskedValue.value = number
            }
        })

        return {
            config,
            maskedValue,
            unmaskedValue,
            input,
            blur,
            change
        }
    },
    template: `
        <input 
            :class="$props.class"
            :placeholder="$props.placeholder"
            v-number="config"
            type="text"
            autocomplete="off"
            :value="maskedValue"
            :readonly="readonly"
            :disabled="disabled"
            @change="change"
            @input="input"
            @blur="blur"
        />
    `,
})