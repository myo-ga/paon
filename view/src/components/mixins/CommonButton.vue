<script>
export default {
    data: () => ({
        isLoading: false
    }),
    methods: {
        getButtonStatus() {
            if (this.isLoading) {
                return {
                    disabled: true,
                    dark: false
                }
            } else {
                return {
                    disabled: false,
                    dark: true
                }
            }
        }
    }
}
</script>