# justifyHack
Простая функция, которая позволяет выставлять одинаковую высоту как блока так и элементов внутри него.

### Установка и использование: ###

* подключите скрипт
* добавьте родительскому блоку с элементами аттрибут "data-justify"
* добавьте в data-justify обект с параметрами

### Пример: ###
##### Допустим нам нужно: #####
Выровнить, блоки child и сделать их в одну высоту, так же внутри этих же блоков нужно сделать child-text одинаковой высоты.

```html
<div class="parent-row" data-justify='[{"justify":".child-text"},{"justify":".child"}]'>
    <div class="child">
        <div class="child-text">Short test</div>
        <div class="child-name">Short name</div>
    </div>
    <div class="child">
        <div class="child-text">
            Long text Long text Long text 
            Long text Long text Long text 
            Long text Long text Long text 
            Long text Long text Long text
        </div>
        <div class="child-name">Long name, Long name, Long name</div>
    </div>
    <div class="child">
        <div class="child-text">Short test</div>
        <div class="child-name">Short name</div>
    </div>
</div>
```