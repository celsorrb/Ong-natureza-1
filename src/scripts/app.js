// Arquivo: src/scripts/app.js - Funcionalidades Interativas e Máscaras

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('volunteer-form');
    const submitButton = document.getElementById('submit-btn');

    if (!form || !submitButton) return;

    // =========================================================
    // 1. FUNÇÕES DE MÁSCARAS
    // =========================================================

    // Aplica máscaras com base no atributo data-mask-type
    document.querySelectorAll('input[data-mask-type]').forEach(input => {
        input.addEventListener('input', (e) => {
            const type = input.getAttribute('data-mask-type');
            let value = e.target.value.replace(/\D/g, ''); // Remove todos os não-dígitos

            if (type === 'cpf') {
                value = value.slice(0, 11);
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d)/, '$1.$2');
                value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
            } else if (type === 'phone') {
                value = value.slice(0, 11);
                value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
                // Ajuste para 9 dígitos móveis ou 8 fixos
                if (value.length > 10) {
                     value = value.replace(/(\d{5})(\d)/, '$1-$2'); 
                } else {
                     value = value.replace(/(\d{4})(\d)/, '$1-$2'); 
                }
            } else if (type === 'cep') {
                value = value.slice(0, 8);
                value = value.replace(/(\d{5})(\d)/, '$1-$2');
            }
            e.target.value = value;
            validateForm(); // Revalida a cada mudança
        });
    });


    // =========================================================
    // 2. VALIDAÇÃO DO FORMULÁRIO (HTML5 NATIVA + CHECAGEM DE MÁSCARA)
    // =========================================================

    function checkValidity(input) {
        const errorElement = input.nextElementSibling;
        if (!errorElement || !errorElement.classList.contains('error-message')) return true;

        let message = '';

        if (input.validity.valueMissing) {
            message = 'Este campo é obrigatório.';
        } else if (input.validity.typeMismatch) {
            if (input.type === 'email') {
                message = 'Por favor, insira um e-mail válido.';
            } else {
                message = 'O valor inserido não é do tipo correto.';
            }
        } else if (input.validity.tooShort) {
            message = `O campo deve ter pelo menos ${input.minLength} caracteres.`;
        } 
        
        // Validação de máscara (checa tamanho final)
        const maskType = input.getAttribute('data-mask-type');
        const cleanValue = input.value.replace(/\D/g, '');
        
        if (maskType === 'cpf' && cleanValue.length !== 11 && cleanValue.length > 0) {
            message = 'CPF inválido (deve ter 11 dígitos).';
        } else if (maskType === 'phone' && cleanValue.length < 10 && cleanValue.length > 0) {
            message = 'Telefone inválido (mínimo 10 dígitos com DDD).';
        } else if (maskType === 'cep' && cleanValue.length !== 8 && cleanValue.length > 0) {
            message = 'CEP inválido (deve ter 8 dígitos).';
        }

        if (message) {
            errorElement.textContent = message;
            input.classList.add('invalid-field');
            return false;
        } else {
            errorElement.textContent = '';
            input.classList.remove('invalid-field');
            return true;
        }
    }

    function validateForm() {
        let isFormValid = true;
        const requiredInputs = form.querySelectorAll('input[required]');

        requiredInputs.forEach(input => {
            // Apenas verifica a validade para determinar se o botão deve ser ativado
            if (!checkValidity(input)) {
                isFormValid = false;
            }
        });

        // Habilita/Desabilita o botão
        submitButton.disabled = !isFormValid;
    }

    // Adiciona listener para todos os inputs
    form.querySelectorAll('input[required]').forEach(input => {
        input.addEventListener('blur', () => { // Valida ao perder o foco
            checkValidity(input);
            validateForm();
        });
        input.addEventListener('input', validateForm); // Revalida ao digitar (para ativar o botão)
    });
    
    // Valida ao carregar a página (o botão começa desabilitado)
    validateForm(); 

    // =========================================================
    // 3. SIMULAÇÃO DE BUSCA DE CEP
    // =========================================================
    const cepInput = document.getElementById('cep');
    const cidadeInput = document.getElementById('cidade');
    const estadoInput = document.getElementById('estado');
    const enderecoInput = document.getElementById('endereco'); 

    cepInput.addEventListener('blur', () => {
        const cleanCep = cepInput.value.replace(/\D/g, '');

        if (cleanCep.length === 8) {
            cidadeInput.placeholder = 'Buscando...';
            estadoInput.placeholder = 'Buscando...';
            
            // Simulação de dados de retorno:
            setTimeout(() => {
                cidadeInput.value = 'Rio de Janeiro'; 
                estadoInput.value = 'RJ'; 
                cidadeInput.placeholder = 'Preenchimento automático via CEP';
                estadoInput.placeholder = 'Preenchimento automático via CEP';
                enderecoInput.focus(); 
            }, 500);
        } else {
            cidadeInput.value = '';
            estadoInput.value = '';
        }
    });
});