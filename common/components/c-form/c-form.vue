<!--
 * @Descripttion:
 * @version: 1.0
 * @Author: sanhui
 * @Date: 2021-06-11 18:26:09
-->
<template>
    <view class="c-form">
        <slot />
    </view>
</template>

<script>
export default {
    name: 'CForm',
    props: {
        check: {
            type: [Boolean, String],
            default: false
        }
    },
    data() {
        return {
            formData: {}
        }
    },
    computed: {
        check_() {
            return String(this.check) !== 'false'
        }
    },
    created() {
        this.children = []
    },
    methods: {
        // 实时校验
        validate() {
            if (!this.check_) return
            this.validateOnce()
        },
        validateOnce() {
            const validateData = {}
            this.children.forEach(o => {
                if (o.pattern) {
                    const name = o.inputName || o.checkBoxName || o.radioName
                    validateData[name] = o.validate()
                }
            })
            this.$emit('validate', {
                type: 'check',
                detail: validateData
            })
        },
        // 重置表单
        emitReset() {
            this.children.forEach(o => {
                o.clear && o.clear()
            })
        },
        // 提交表单
        emitSubmit(e) {
            const formData = {}
            this.children.forEach(o => {
                console.log()
                if (o.$options.name === 'CRadioGroup') {
                    formData[o.radioName] = o.radioValue
                } else if (o.$options.name === 'CInput') {
                    formData[o.inputName] = o.inputValue
                } else if (o.$options.name === 'CCheckboxGroup') {
                    formData[o.checkBoxName] = o.value
                }
            })
            this.$emit('submit', {
                type: 'submit',
                detail: {
                    target: e.target,
                    value: formData
                }
            })
        }
    }
}
</script>
