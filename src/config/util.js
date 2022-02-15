/*
 * @Descripttion:
 * @version: 1.0
 * @Author: sky
 * @Date: 2021-12-01 17:17:34
 */
export const defineCheck = (opt) => {
    return {
        value: '',
        type: 'input',
        list: [],
        disabled: false,
        isShow: true,
        isCollapse: true,
        label: '',
        name: '',
        isIcon: false,
        ...opt
    }
}

export const omit = (source, opt) => {
    const result = {}
    for (const i in source) {
        if (!opt.includes(i)) {
            result[i] = source[i]
        }
    }
    return result
}

