import pinyin from 'pinyin';

/**
 * 将包含中文的字符串转换为合法的 JavaScript 变量名
 * @param {string} input - 输入字符串
 * @returns {string} - 转换后的变量名
 */
function tovar(input) {
    if (!input) return '_';

    // 1. 获取每个字符的拼音（无音调，每个汉字取第一个读音）
    const pinyinResult = pinyin(input, {
        style: pinyin.STYLE_NORMAL,
        heteronym: false
    });

    // 2. 构建中间字符串：中文替换为拼音，非中文保留原字符
    let raw = '';
    for (let i = 0; i < input.length; i++) {
        if (pinyinResult[i] && pinyinResult[i].length > 0) {
            raw += pinyinResult[i][0]; // 取第一个拼音
        } 
    }



    // 3. 将所有非字母数字的连续字符替换为单个下划线
    let variableName = raw.replace(/[^a-zA-Z0-9]+/g, '_');

    // 4. 去除开头和结尾的下划线（可选）
    variableName = variableName.replace(/^_+|_+$/g, '');

    // 5. 如果以数字开头，在前面加下划线
    if (/^[0-9]/.test(variableName)) {
        variableName = '_' + variableName;
    }

    // 6. 如果结果为空，返回默认下划线
    return variableName || '_';
}

export default tovar;
