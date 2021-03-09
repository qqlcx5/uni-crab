import refundMixins from "@/common/mixins/goods/refund/main";
export default {
    mixins: [refundMixins],
    data() {
        return {};
    },
    onLoad() {
        this.handleOrderReturnIndex();
    },
    computed: {
        theme_() {
            return (index = 0, pro = "return_pattern") => {
                return this[pro][index].checked
                    ? ["t"]
                    : ["#666666", "#B8B8B8"];
            };
        }
    },
    methods: {
        changeChecked(value) {
            this.$jumpDetail("refuseApplyRefund", this.$Route.query.detailId, {
                value: String(value),
                id: this.$Route.query.id
            });
        }
    }
};
