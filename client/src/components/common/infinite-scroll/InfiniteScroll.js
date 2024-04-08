export default {

    created(el, binding) {
        const alreadyScrolled = []

        // see below for details on arguments
        el.addEventListener('scroll', (event) => {
            if (
                event.target.getAttribute('infinite-scroll-hasMore') === 'true' &&
                !alreadyScrolled.includes(event.target.scrollHeight) &&
                event.target.scrollTop + event.target.clientHeight >= event.target.scrollHeight - 100
            ) {
                alreadyScrolled.push(event.target.scrollHeight)
                binding.value.next()
            }
        })

    }
}