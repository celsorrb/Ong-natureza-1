document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('volunteer-form');
    const submitBtn = document.getElementById('submit-btn');

    // Verifica se o formulário e o botão existem antes de continuar
    if (!form || !submitBtn) {
        return; 
    }

    // ===================================
    // 1. LÓGICA DAS MÁSCARAS (NOVO CÓDIGO)
    // ===================================

    // Aplica a máscara de CPF: 000.000.000-00
    function maskCPF(value) {
        return value
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o primeiro ponto
            .replace(/(\d{3})(\d)/, '$1.$2') // Coloca o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2') // Coloca o hífen
            .replace(/(-\d{2})\d+?$/, '$1'); // Limita a 11 dígitos
    }

    // Aplica a máscara de Telefone: (XX) 9XXXX-XXXX ou (XX) XXXX-XXXX
    function maskTelefone(value) {
        return value
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/^(\d{2})(\d)/g, '($1) $2') // Coloca parênteses e espaço
            .replace(/(\d{4})(\d)/, '$1-$2') // Coloca hífen (para 8 dígitos)
            .replace(/(\d{5}-\d{4})\d+?$/, '$1'); // Limita a 9 dígitos (com hífen)
    }

    // Aplica a máscara de CEP: 00000-000
    function maskCEP(value) {
        return value
            .replace(/\D/g, '') // Remove tudo o que não é dígito
            .replace(/^(\d{5})(\d)/, '$1-$2') // Coloca o hífen
            .replace(/(-\d{3})\d+?$/, '$1'); // Limita a 8 dígitos
    }

    // Aplica as máscaras nos campos ao digitar
    document.getElementById('cpf').addEventListener('input', function(e) {
        e.target.value = maskCPF(e.target.value);
    });

    document.getElementById('telefone').addEventListener('input', function(e) {
        e.target.value = maskTelefone(e.target.value);
    });

    document.getElementById('cep').addEventListener('input', function(e) {
        e.target.value = maskCEP(e.target.value);
    });

    // ===================================
    // 2. VALIDAÇÃO (ATUALIZADA)
    // ===================================

    // Campos OBRIGATÓRIOS (Atualizado com CPF, Data de Nasc, Endereço, Cidade e Estado)
    const requiredInputs = [
        document.getElementById('nome'),
        document.getElementById('cpf'), // NOVO
        document.getElementById('dataNascimento'), // NOVO
        document.getElementById('email'),
        document.getElementById('cep'), // NOVO
        document.getElementById('endereco'), // NOVO
        document.getElementById('cidade'), // NOVO
        document.getElementById('estado'), // NOVO
        document.getElementById('interesse')
    ];

    /**
     * Função que verifica se todos os campos obrigatórios estão preenchidos.
     * @returns {boolean} Retorna true se todos estiverem válidos, false caso contrário.
     */
    function validateForm() {
        let isFormValid = true;

        requiredInputs.forEach(input => {
            const value = input.value.trim();
            const isSelect = input.tagName === 'SELECT';

            // Verifica se o valor está vazio ou se é a opção de placeholder do select
            if (value === '' || (isSelect && value === 'Selecione a área' || value === 'Selecione o Estado')) {
                isFormValid = false;
                input.classList.add('is-invalid');
            } else {
                input.classList.remove('is-invalid');
            }
        });

        // Validação adicional para o email (formato básico)
        const emailInput = document.getElementById('email');
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            isFormValid = false;
        }

        // Validação adicional para o CPF (após a máscara, verifica o tamanho mínimo)
        const cpfInput = document.getElementById('cpf');
        if (cpfInput.value.replace(/\D/g, '').length !== 11) {
            cpfInput.classList.add('is-invalid');
            isFormValid = false;
        }
        
        return isFormValid;
    }

    /**
     * Função principal para habilitar ou desabilitar o botão de envio.
     */
    function toggleSubmitButton() {
        if (validateForm()) {
            submitBtn.removeAttribute('disabled');
        } else {
            submitBtn.setAttribute('disabled', 'disabled');
        }
    }

    // Adiciona o listener para monitorar mudanças nos campos obrigatórios
    requiredInputs.forEach(input => {
        input.addEventListener('input', toggleSubmitButton);
        input.addEventListener('change', toggleSubmitButton);
    });

    // Intercepta o envio do formulário para evitar o erro 405 e dar um feedback
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio real do formulário
        
        if (validateForm()) {
            submitBtn.textContent = 'Obrigado por se cadastrar!';
            submitBtn.style.backgroundColor = '#6AA84F'; // Verde claro para sucesso
            
            // Opcional: Desabilitar os campos após o "envio" virtual
            requiredInputs.forEach(input => input.setAttribute('disabled', 'disabled'));
            submitBtn.setAttribute('disabled', 'disabled');
        }
    });

    // Chama a função uma vez no carregamento para definir o estado inicial do botão
    toggleSubmitButton();
});
