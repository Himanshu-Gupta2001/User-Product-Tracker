export default {
    updated(el, binding) {
        if ((typeof binding.value) !== 'boolean') {
            console.warn('v-loader must be type boolean')
            return;
        }
        if (binding.value) {
            if (el.firstChild.className !== 'dot-loader') {
                const newChild = document.createElement('div');
                newChild.innerHTML = '<span></span><span></span><span></span><span></span><span></span>';
                newChild.classList.add('dot-loader');
                el.insertBefore(newChild, el.firstChild);
            }
        } else if (el.firstChild.className === 'dot-loader') {
            el.removeChild(el.firstChild)
        }
    }
}