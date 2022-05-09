const keyboard = {

    languages: ['en', 'ru'],

    systemkeys: ['Backspace', 'Control', 'Shift', 'Alt', 'Enter', 'Tab', 'CapsLock', 'Space'],

    keyLayout: [
        '`', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', '<br>',
        'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '[', ']', '\\', '<br>',
        'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ';', '\'', 'Enter', '<br>',
        'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', ',', '.', '/', 'Shift', '<br>',
        'Control', 'Alt', 'Space', 'Alt', 'Control', '<br>'

    ],

    shiftKeyLayout: [
        '~', '!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '+', 'Backspace', '<br>',
        'Tab', 'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '{', '}', '|', '<br>',
        'CapsLock', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', ':', '"', 'Enter', '<br>',
        'Shift', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '<', '>', '?', 'Shift', '<br>',
        'Control', 'Alt', 'Space', 'Alt', 'Control', '<br>'
    ],

    ru_keyLayout: [
        'ё', '1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '=', 'Backspace', '<br>',
        'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '\\', '<br>',
        'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter', '<br>',
        'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', '.', 'Shift', '<br>',
        'Control', 'Alt', 'Space', 'Alt', 'Control', '<br>'

    ],

    ru_shiftKeyLayout: [
        'Ё', '!', '"', '№', ';', '%', ':', '?', '*', '(', ')', '-', '+', 'Backspace', '<br>',
        'Tab', 'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '//', '<br>',
        'CapsLock', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'Enter', '<br>',
        'Shift', 'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю', ',', 'Shift', '<br>',
        'Control', 'Alt', 'Space', 'Alt', 'Control', '<br>'
    ],

    language: 'en',

    elements: {
        main: null,
        keysContainer: null,
        keys: []
    },

    eventHandlers: {
        oninput: null,
        onclose: null
    },

    properties: {
        value: '',
        capsLock: false
    },


    init() {
        this.elements.main = document.createElement('div');
        this.elements.keysContainer = document.createElement('div');

        this.elements.main.classList.add('keyboard', 'keyboard--hidden');
        this.elements.keysContainer.classList.add('keyboard__keys');
        this.elements.keysContainer.appendChild(this._createKeys());

        this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

        this.elements.main.appendChild(this.elements.keysContainer);
        document.body.appendChild(this.elements.main);

        document.querySelectorAll('.use-keyboard-input').forEach(element => {
            this.open(element.value, currentValue => {
                element.value = currentValue;
            });
        });

        document.addEventListener('keyup', event => {
            if (event.key == 'Shift' && event.altKey || event.key == 'Alt' && event.shiftKey) {
                const nextLanguage = this.language === "en" ? "ru" : "en"
                this.language = nextLanguage
                this._changeLanguage()
            }
        })

        if (localStorage.getItem('lang')) {
            this.language = localStorage.getItem('lang');
            this._changeLanguage()
        }

    },

    _changeLanguage() {
        localStorage.setItem('lang', this.language);
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                const index = this.keyLayout.indexOf(key.dataset.key)
                let keyValue = this._currentKeyLayout(false)[index]
                key.textContent = this.properties.capsLock ? keyValue.toUpperCase() : keyValue.toLowerCase();
            }
        }
    },

    _currentKeyLayout(shiftPressed) {
        if (this.language == "en") {
            return shiftPressed ? this.shiftKeyLayout : this.keyLayout
        }
        if (this.language == "ru") {
            return shiftPressed ? this.ru_shiftKeyLayout : this.ru_keyLayout
        }
    },

    _createKeys() {
        const fragment = document.createDocumentFragment();

        this.keyLayout.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.dataset.key = key
            const insertLineBreak = ['<br>'].indexOf(key) !== -1;

            keyElement.setAttribute('type', 'button');
            keyElement.classList.add('keyboard__key');

            switch (key) {
                case 'Backspace':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.textContent = "Backspace";

                    keyElement.addEventListener('click', () => {
                        this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                        this._triggerEvent('oninput');
                    });

                    document.addEventListener("keyup", event => {
                        if (event.key === key) {
                            this.properties.value = this.properties.value.substring(0, this.properties.value.length - 1);
                            this._triggerEvent('oninput');
                        }
                    })

                    break;


                case 'CapsLock':
                    keyElement.classList.add('keyboard__key--wide', 'keyboard__key--activatable');
                    keyElement.textContent = "Caps Lock";

                    keyElement.addEventListener('click', () => {
                        this._toggleCapsLock();
                        keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                    });

                    document.addEventListener("keyup", event => {
                        if (event.key === key) {
                            this._toggleCapsLock();
                            keyElement.classList.toggle('keyboard__key--active', this.properties.capsLock);
                        }
                    })

                    break;

                case 'Enter':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.textContent = 'Enter';

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '\n';
                        this._triggerEvent('oninput');
                    });

                    document.addEventListener("keyup", event => {
                        if (event.key === "Enter") {
                            this.properties.value += '\n';
                            this._triggerEvent('oninput');
                        }
                    })
                    break;

                case 'Tab':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.textContent = 'Tab';

                    keyElement.addEventListener('click', () => {
                        this.properties.value += '   ';
                        this._triggerEvent('oninput');
                    });

                    document.addEventListener("keyup", event => {
                        if (event.key === "Tab") {
                            this.properties.value += '\n';
                            this._triggerEvent('oninput');
                        }
                    })

                    break;

                case 'Space':
                    keyElement.classList.add('keyboard__key--extra-wide');
                    keyElement.textContent = "_";

                    keyElement.addEventListener('click', () => {
                        this.properties.value += ' ';
                        this._triggerEvent('oninput');
                    });
                    document.addEventListener("keyup", event => {
                        if (event.key === ' ') {
                            this.properties.value += ' ';
                            this._triggerEvent('oninput');
                            keyElement.classList.toggle('active')
                        }
                    })
                    document.addEventListener("keydown", event => {
                        if (event.key === ' ') {
                            keyElement.classList.toggle('active')
                        }
                    })
                    break;

                case 'Shift':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.textContent = "Shift";

                    keyElement.addEventListener('mousedown', () => {
                        this._toggleShift(true);

                    });

                    keyElement.addEventListener('mouseup', () => {
                        this._toggleShift(false);

                    });
                    document.addEventListener("keydown", event => {
                        if (event.key === "Shift") {
                            this._toggleShift(true);
                        }
                    })

                    document.addEventListener("keyup", event => {
                        if (event.key === "Shift") {
                            this._toggleShift(false);
                        }
                    })
                    break;

                case 'Control':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.textContent = "Ctrl";

                    break;

                case 'Alt':
                    keyElement.classList.add('keyboard__key--wide');
                    keyElement.textContent = "Alt";

                    break;

                case '<br>':
                    break;

                default:
                    keyElement.textContent = key.toLowerCase();
                    keyElement.addEventListener('click', () => {
                        this.properties.value += keyElement.textContent
                        this._triggerEvent('oninput');
                    });


                    document.addEventListener("keyup", event => {
                        if (event.key === keyElement.textContent) {
                            this.properties.value += keyElement.textContent;
                            this._triggerEvent('oninput');
                        }
                    })

                    break;
            }



            document.addEventListener("keydown", event => {
                if (event.key === keyElement.textContent || event.key === key) {
                    keyElement.classList.toggle('active')
                }
            })

            document.addEventListener("keyup", event => {
                if (event.key === keyElement.textContent || event.key === key) {
                    keyElement.classList.toggle('active')
                }
            })

            if (insertLineBreak) {
                fragment.appendChild(document.createElement('br'));
            } else {
                fragment.appendChild(keyElement);
            }


        });
        return fragment;
    },



    _triggerEvent(handlerName) {
        if (typeof this.eventHandlers[handlerName] == 'function') {
            this.eventHandlers[handlerName](this.properties.value);
        }
    },

    _toggleCapsLock() {
        this.properties.capsLock = !this.properties.capsLock;

        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                if (this.systemkeys.indexOf(key.dataset.key) === -1) {
                    key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
                }
            }
        }
    },

    _toggleShift(shiftPressed) {
        for (const key of this.elements.keys) {
            if (key.childElementCount === 0) {
                if (this.systemkeys.indexOf(key.dataset.key) === -1) {
                    const index = this.keyLayout.indexOf(key.dataset.key)
                    const value = this._currentKeyLayout(shiftPressed)[index]
                    key.textContent = (shiftPressed === this.properties.capsLock) ? value.toLowerCase() : value.toUpperCase();
                }
            }
        }
    },

    open(initialValue, oninput, onclose) {
        this.properties.value = initialValue || '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.remove('keyboard--hidden');

    },

    close() {
        this.properties.value - '';
        this.eventHandlers.oninput = oninput;
        this.eventHandlers.onclose = onclose;
        this.elements.main.classList.add('keyboard--hidden');

    },
}


window.addEventListener('DOMContentLoaded', function () {
    keyboard.init();
})
