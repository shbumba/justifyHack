$(function () {
    $('[data-justify]').each(function () {
        var that = $(this), //Область в которой пройдет инициализация скрипта, и поиск дочерних элементов исходя из объекта justifyJson
            justify = $(this).attr('data-justify'),//Объект с параметрами для выравнивания.
            isFirstInit = true, //Проверка на то является ли инициализация для блоков первой.
            totalItems = 0, //Количество всех элементов, действительных для главного цикла
            totalItemsTemp = 0, //Переменная для isFirstInit, которая содержет копию totalItems
            made = [];

        var justifyJson = null;

        if (justify != undefined && justify.length > 0) {
            try {
                justifyJson = JSON.parse(justify);
            } catch (e) {
                justifyJson = null
            }
        }

        /**
         * Прекращаем выполнение если возникли ошибки при анализе JSON
         */
        if (justifyJson === null) {
            return false;
        }

        /**
         * Получаем количество всех элементов
         */
        $.each(justifyJson, function (key, val) {
            if (val.justify) {
                var justifyItem = val.justify, //Элемент для поиска в DOM, относительно родителя [data-justify]
                    blocks = that.find(justifyItem); //Количество всех найденых элементов

                totalItems += blocks.length;
            }
        });

        totalItemsTemp = totalItems;

        /**
         * Прекращаем выполнение если нет элементов для выполнения скрипта
         */
        if (totalItems <= 0) {
            return false;
        }

        /**
         * Основная функция
         */
        var justifyHack = function () {
            /**
             * Проходим по объекту "justifyJson"
             */
            $.each(justifyJson, function (key, val) {
                /**
                 * Проверяем определен ли в элементе обекта ключ "justify" содержащий класс для поиска элемента в DOM
                 */
                if (val.justify) {
                    var justifyItem = val.justify, //Элемент для поиска в DOM, относительно родителя [data-justify]
                        blocks = that.find(justifyItem), //Результат с найдеными элементами
                        blocksLength = blocks.length, //Количество всех найденых элементов
                        added = (val.added) ? parseInt(val.added) : 0; //Нужно ли добавить к элементам дополнительные пиксели, учавствует в функции afterCallback, дополняя maxHeight

                    /**
                     * Проверяем существуют ли элементы в DOM
                     */
                    if (blocksLength > 0) {
                        /**
                         * Объект содержащий позиции эллементов в одной линии
                         * Главным ключем элемента объекта - является позиция всей линии элементов от top,
                         * он так же содережет 2 ключа:
                         *      maxHeight (float) - его значением является максимальная высота блока в линии
                         *      items (array) - содержит элементы линии, которые должны быть выравнены
                         *
                         * @type {{}}
                         */
                        var heightObj = {};

                        if (made.indexOf(justifyItem) != -1) {
                            added = 0;
                        }

                        /**
                         * Функция afterCallback проходится по объекту heightObj
                         * применяя на элементы items максимальную высоту maxHeight.
                         * Попутно добавляя отработанный результат в объект made, если его там нет
                         *
                         * @returns {boolean}
                         */
                        var afterCallback = function () {
                            if (Object.keys(heightObj).length <= 0) return false;

                            $.each(heightObj, function (key, val) {
                                var maxHeight = val.maxHeight,
                                    items = val.items;

                                if (items.length <= 0)  return false;

                                maxHeight = parseInt(maxHeight);
                                maxHeight = maxHeight + added;

                                $.each(items, function (key, val) {
                                    $(val).css({
                                        height: maxHeight
                                    });
                                });
                            });

                            if (made.indexOf(justifyItem) == -1) {
                                made.push(justifyItem);
                            }
                        };

                        /**
                         * Проверяем является ли инициализация для блоков первой.
                         * И проходим по blocks добавляя им стиль height с высотой этих же блоков
                         * Нужно для дополнительной фиксации элементов, в одной линии, используется только в первой инициализации
                         */
                        if (isFirstInit == true) {
                            var fixHeight = 0;

                            $.each(blocks, function (key, val) {
                                if (fixHeight == 0) {
                                    fixHeight = val.scrollHeight;
                                }

                                $(val).css({
                                    height: fixHeight
                                });

                                --totalItemsTemp;
                            });

                            if (totalItemsTemp == 0) {
                                isFirstInit = false;
                            }
                        }

                        /**
                         * Проходим по blocks и составляем объект heightObj.
                         * По окончанию цикла выполняется функция afterCallback
                         */
                        $.each(blocks, function (key, val) {
                            var blockSelf = $(val),
                                blockHeight = val.scrollHeight,
                                offsetBlock = blockSelf.offset();

                            if (heightObj[offsetBlock.top] == undefined) {
                                heightObj[offsetBlock.top] = {
                                    maxHeight: 0,
                                    items: []
                                };
                            }

                            heightObj[offsetBlock.top].items.push(blockSelf);

                            if (heightObj[offsetBlock.top].maxHeight < blockHeight) {
                                heightObj[offsetBlock.top].maxHeight = blockHeight;
                            }

                            if (blocksLength - 1 == key) {
                                afterCallback();
                            }
                        });
                    }
                }
            });
        };

        //Регистрируем событие на пересортировку.
        $(window).on('load resize', function () {
            justifyHack();
        });

        return true;
    });
})();