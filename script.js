// ========== VARIABLES GLOBALES ==========
        // Referencias a elementos del HTML
        const display = document.getElementById('display');
        const buttons = document.querySelectorAll('.button');
        const clock = document.getElementById('clock');

        // Variables para guardar el estado de la calculadora
        let currentValue = '0';           // Número que se está mostrando en pantalla
        let firstValue = null;            // Primer número de la operación
        let operator = null;              // Operador seleccionado (+, -, *, /)
        let waitingForSecondValue = false; // Indica si espera el segundo número

        // ========== ACTUALIZAR PANTALLA ==========
        // Muestra el valor actual en el display
        function updateDisplay() {
            display.value = currentValue;
        }

        // ========== REALIZAR OPERACIÓN MATEMÁTICA ==========
        // Realiza la operación entre dos números según el operador
        // Evita división entre cero mostrando 'Error'
        function calculate(first, second, op) {
            const a = parseFloat(first);
            const b = parseFloat(second);
            if (op === '+') return (a + b).toString();
            if (op === '-') return (a - b).toString();
            if (op === '*') return (a * b).toString();
            if (op === '/') return b === 0 ? 'Error' : (a / b).toString();
            return second;
        }

        // ========== MANEJAR NÚMEROS (0-9) ==========
        // Agrega dígitos al display
        // Si esperaba segundo número, lo reemplaza; si no, lo concatena
        function handleDigit(value) {
            if (waitingForSecondValue) {
                currentValue = value;
                waitingForSecondValue = false;
            } else {
                currentValue = currentValue === '0' ? value : currentValue + value;
            }
        }

        // ========== MANEJAR PUNTO DECIMAL ==========
        // Añade el punto decimal al número actual
        // Evita múltiples puntos decimales en el mismo número
        function handleDecimal() {
            if (waitingForSecondValue) {
                currentValue = '0.';
                waitingForSecondValue = false;
                return;
            }
            if (!currentValue.includes('.')) {
                currentValue += '.';
            }
        }

        // ========== MANEJAR OPERADORES (+, −, ×, ÷) ==========
        // Guarda el primer número y el operador
        // Si ya había una operación, calcula el resultado primero
        // Prepara la calculadora para recibir el segundo número
        function handleOperator(nextOperator) {
            const inputValue = currentValue;
            if (operator && waitingForSecondValue) {
                operator = nextOperator;
                return;
            }
            if (firstValue === null) {
                firstValue = inputValue;
            } else if (operator) {
                const result = calculate(firstValue, inputValue, operator);
                currentValue = result;
                firstValue = result === 'Error' ? null : result;
            }
            waitingForSecondValue = true;
            operator = nextOperator;
        }

        // ========== CALCULAR RESULTADO (botón =) ==========
        // Realiza la operación final y muestra el resultado
        // Limpia las variables para la siguiente operación
        function handleCalculate() {
            if (operator === null || waitingForSecondValue) return;
            currentValue = calculate(firstValue, currentValue, operator);
            operator = null;
            firstValue = null;
            waitingForSecondValue = false;
        }

        // ========== LIMPIAR CALCULADORA (botón C) ==========
        // Reinicia todos los valores a su estado inicial
        function handleClear() {
            currentValue = '0';
            firstValue = null;
            operator = null;
            waitingForSecondValue = false;
        }

        // ========== CALCULAR PORCENTAJE (botón %) ==========
        // Divide el número actual entre 100
        function handlePercent() {
            currentValue = (parseFloat(currentValue) / 100).toString();
        }

        // ========== CAMBIAR SIGNO (botón ±) ==========
        // Multiplica el número actual por -1 (positivo ↔ negativo)
        function handleSign() {
            currentValue = (parseFloat(currentValue) * -1).toString();
        }

        // ========== DETECTOR DE CLICS EN BOTONES ==========
        // Escucha cuando el usuario hace clic en cualquier botón
        // Identifica qué acción realizar según el atributo 'data-action' del botón
        // Ejecuta la función correspondiente y actualiza el display
        buttons.forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const value = button.dataset.value;
                switch (action) {
                    case 'digit':
                        handleDigit(value);
                        break;
                    case 'decimal':
                        handleDecimal();
                        break;
                    case 'operator':
                        handleOperator(value);
                        break;
                    case 'calculate':
                        handleCalculate();
                        break;
                    case 'clear':
                        handleClear();
                        break;
                    case 'percent':
                        handlePercent();
                        break;
                    case 'sign':
                        handleSign();
                        break;
                }
                updateDisplay();
            });
        });

        