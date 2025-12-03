/**
 * 基于聚类的智能章节排序系统
 * 使用模式识别将章节分组，然后在组内排序
 */

/**
 * 提取章节的模式和数字
 * @param {string} chapterName - 章节名称
 * @returns {Object} { pattern: string, number: number, originalName: string }
 */
function extractPattern(chapterName) {
    const lowerName = chapterName.toLowerCase().trim();

    // 序章
    if (/^(prologue|prolog|序章|序|开篇)/i.test(lowerName)) {
        return {
            pattern: 'prologue',
            number: 0,
            originalName: chapterName,
            type: 'prologue'
        };
    }

    // 尾声
    if (/^(epilogue|epilog|尾声|终章|结局)/i.test(lowerName)) {
        return {
            pattern: 'epilogue',
            number: 0,
            originalName: chapterName,
            type: 'epilogue'
        };
    }

    // 特殊章节（Extra, Bonus, Special, Side Story, 番外等）
    if (/^(extra|bonus|special|side[\s-]?story|omake|番外|特别篇|特典)/i.test(lowerName)) {
        const numMatch = lowerName.match(/(\d+(?:\.\d+)?)/);
        return {
            pattern: 'special',
            number: numMatch ? parseFloat(numMatch[1]) : 0,
            originalName: chapterName,
            type: 'special'
        };
    }

    // 标准章节格式 - Chapter/Ch/Episode/Ep等
    const standardPatterns = [
        { regex: /^(chapter|ch|chap)[\s.-]*(\d+(?:\.\d+)?)/i, name: 'chapter' },
        { regex: /^(episode|ep)[\s.-]*(\d+(?:\.\d+)?)/i, name: 'episode' },
        { regex: /^(#)(\d+(?:\.\d+)?)/i, name: 'hash' },
    ];

    for (const { regex, name } of standardPatterns) {
        const match = lowerName.match(regex);
        if (match) {
            return {
                pattern: name,
                number: parseFloat(match[2]),
                originalName: chapterName,
                type: 'normal'
            };
        }
    }

    // 中文章节格式
    const chineseMatch = lowerName.match(/^第?(\d+(?:\.\d+)?)(?:话|話|集|章|回)/);
    if (chineseMatch) {
        return {
            pattern: 'chinese',
            number: parseFloat(chineseMatch[1]),
            originalName: chapterName,
            type: 'normal'
        };
    }

    // 纯数字格式（001, 002, 150等）
    const numericMatch = lowerName.match(/^(\d{1,4})(?:[\s.-]|$)/);
    if (numericMatch) {
        return {
            pattern: 'numeric',
            number: parseFloat(numericMatch[1]),
            originalName: chapterName,
            type: 'normal'
        };
    }

    // 提取任何包含数字的模式
    const anyNumberMatch = lowerName.match(/^([^\d]+)[\s.-]*(\d+(?:\.\d+)?)/);
    if (anyNumberMatch) {
        const patternName = anyNumberMatch[1].trim().toLowerCase();
        return {
            pattern: patternName || 'unknown',
            number: parseFloat(anyNumberMatch[2]),
            originalName: chapterName,
            type: 'normal'
        };
    }

    // 无法识别的章节，使用原名作为pattern
    return {
        pattern: 'unknown',
        number: 0,
        originalName: chapterName,
        type: 'unknown',
        fallbackSort: chapterName
    };
}

/**
 * 将章节按模式聚类
 * @param {string[]} chapterNames - 章节名称数组
 * @returns {Map<string, Array>} 聚类结果
 */
function clusterChapters(chapterNames) {
    const clusters = new Map();

    for (const name of chapterNames) {
        const extracted = extractPattern(name);
        const key = extracted.pattern;

        if (!clusters.has(key)) {
            clusters.set(key, []);
        }
        clusters.get(key).push(extracted);
    }

    return clusters;
}

/**
 * 获取组的优先级（用于组间排序）
 * @param {string} pattern - 模式名称
 * @returns {number} 优先级权重
 */
function getGroupPriority(pattern) {
    const priorities = {
        'prologue': 0,          // 序章最前
        'chapter': 1000,        // Chapter/Ch/Chap
        'episode': 1000,        // Episode/Ep
        'hash': 1000,           // #123
        'chinese': 1000,        // 第X话
        'numeric': 1000,        // 纯数字
        'special': 9000,        // Extra/Bonus/Special
        'unknown': 9500,        // 未知格式
        'epilogue': 10000       // 尾声最后
    };

    const priority = priorities[pattern];
    // 0 是有效值，所以需要显式检查 undefined
    return priority !== undefined ? priority : 1000;
}

/**
 * 组内排序
 * @param {Array} chapters - 章节对象数组
 */
function sortWithinGroup(chapters) {
    chapters.sort((a, b) => {
        // 首先按数字排序
        if (a.number !== b.number) {
            return a.number - b.number;
        }
        // 数字相同时，按原名排序
        return a.originalName.localeCompare(b.originalName, undefined, {
            numeric: true,
            sensitivity: 'base'
        });
    });
}

/**
 * 智能排序章节（基于聚类）
 * @param {string[]} folderNames - 章节文件夹名称数组
 * @param {Object} options - 配置选项
 * @returns {Array} 排序后的章节信息数组
 */
export function sortChapters(folderNames, options = {}) {
    const {
        reverseOrder = true,  // 最新章节在前
        showProgress = false  // 是否显示进度
    } = options;

    if (showProgress) {
        console.log(`📊 Parsing ${folderNames.length} chapters...`);
    }

    // 1. 聚类
    const clusters = clusterChapters(folderNames);

    if (showProgress) {
        console.log(`   ✓ Found ${clusters.size} pattern groups`);
    }

    // 2. 每组内排序
    for (const [pattern, chapters] of clusters.entries()) {
        sortWithinGroup(chapters);
        if (showProgress) {
            console.log(`   📦 ${pattern}: ${chapters.length} chapters`);
        }
    }

    // 3. 组间排序（按优先级）
    const sortedGroups = Array.from(clusters.entries())
        .sort((a, b) => {
            const priorityA = getGroupPriority(a[0]);
            const priorityB = getGroupPriority(b[0]);
            if (priorityA !== priorityB) return priorityA - priorityB;
            // 相同优先级按pattern名称排序，保持一致性
            return a[0].localeCompare(b[0]);
        });

    // 4. 合并结果
    let result = sortedGroups.flatMap(([_, chapters]) => chapters);

    // 5. 如果需要倒序
    if (reverseOrder) {
        result.reverse();
    }

    return result;
}

/**
 * 生成章节号（用于 manifest.json）
 * @param {Object} chapterInfo - 解析后的章节信息
 * @param {number} index - 在排序后数组中的索引
 * @returns {number} 章节号
 */
export function generateChapterNumber(chapterInfo, index) {
    // 特殊章节使用特殊编号
    if (chapterInfo.type === 'prologue') {
        return 0;
    }
    if (chapterInfo.type === 'epilogue') {
        return 9999;
    }
    if (chapterInfo.type === 'special') {
        return 9000 + (chapterInfo.number || 0);
    }

    // 普通章节：如果有明确的章节号，使用它
    if (chapterInfo.number > 0 && chapterInfo.type === 'normal') {
        return chapterInfo.number;
    }

    // 兜底：使用索引
    return index + 1;
}

/**
 * 测试函数
 */
export function testChapterSorter() {
    const testCases = [
        'Chapter 1',
        'Chapter 2',
        'Chapter 10',
        'Ch 1.5',
        'Prologue',
        'Epilogue',
        'Extra 1',
        'Extra 2',
        'Bonus Chapter',
        '001',
        '002',
        '150',
        '第1话',
        '第2话',
        '第10话',
        'Side Story 1',
        'Special Episode 3',
        'Random Name Without Numbers',
    ];

    console.log('=== Chapter Sorter Test ===\n');
    const sorted = sortChapters(testCases, {
        reverseOrder: false,
        showProgress: true
    });

    console.log('\n=== Sorted Results ===\n');
    sorted.forEach((info, index) => {
        console.log(`${index + 1}. ${info.originalName}`);
        console.log(`   Pattern: ${info.pattern} | Number: ${info.number} | Type: ${info.type}`);
    });
}

// 如果直接运行此文件，执行测试
if (import.meta.url === `file://${process.argv[1]}`) {
    testChapterSorter();
}
