document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('volunteer-form');
    const submitBtn = document.getElementById('submit-btn');

    // Verifica se o formulário e o botão existem antes de continuar (pode não existir em index.html/projetos.html)
    if (!form || !submitBtn) {
        return; 
    }

    // Campos obrigatórios que precisam ser validados
    const requiredInputs = [
        document.getElementById('nome'),
        document.getElementById('email'),
        document.getElementById('interesse')
    ];

    /**
     * Função que verifica se todos os campos obrigatórios estão preenchidos.
     * @returns {boolean} Retorna true se todos estiverem válidos, false caso contrário.
     */
    function validateForm() {
        let isFormValid = true;

        requiredInputs.forEach(input => {
            // Verifica o valor do campo (remove espaços em branco)
            const value = input.value.trim();

            if (value === '' || value === 'Selecione a área') {
                isFormValid = false;
                // Adiciona uma classe de erro para feedback visual
                input.classList.add('is-invalid');
            } else {
                // Remove a classe de erro se estiver válido
                input.classList.remove('is-invalid');
            }
        });

        // Validação adicional para o email (formato básico)
        const emailInput = document.getElementById('email');
        // Apenas valida se o campo existe e se o valor não está vazio antes de testar a regex
        if (emailInput && emailInput.value.trim() !== '' && !validateEmail(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            isFormValid = false;
        } else if (emailInput) {
            // Se estiver vazio (e a validação acima já o marcou como inválido) ou se estiver correto
            // Apenas remove a classe de inválido se o formulário geral ainda for válido
            if (emailInput.value.trim() !== '' && validateEmail(emailInput.value)) {
                 emailInput.classList.remove('is-invalid');
            }
        }

        return isFormValid;
    }

    /**
     * Valida um formato básico de e-mail usando regex.
     */
    function validateEmail(email) {
        // Regex básica que verifica se tem algo@algo.algo
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; 
        return re.test(String(email).toLowerCase());
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
        // Monitora eventos de digitação/mudança
        input.addEventListener('input', toggleSubmitButton);
        input.addEventListener('change', toggleSubmitButton);
    });

    // Intercepta o envio do formulário para evitar o erro 405 e dar um feedback
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // Impede o envio real do formulário
        
        if (validateForm()) {
            // Se for válido (passou pela validação JS), dá o feedback de sucesso
            submitBtn.textContent = 'Obrigado por se cadastrar!';
            submitBtn.style.backgroundColor = '#6AA84F'; // Verde claro para sucesso
            
            // Opcional: Desabilitar os campos após o "envio" virtual
            requiredInputs.forEach(input => input.setAttribute('disabled', 'disabled'));
            // Desabilitar o botão novamente
            submitBtn.setAttribute('disabled', 'disabled');
        }
    });

    // Chama a função uma vez no carregamento para definir o estado inicial do botão
    toggleSubmitButton();
});
