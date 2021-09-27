class ValidaFormulario{
    constructor(){
        this.formulario = document.querySelector('#formulario');
        this.envio = 1;
        this.eventos();
    }

    eventos(){
        this.formulario.addEventListener('submit', evento =>{
            this.handleSubmit(evento);
        });
        document.addEventListener('click', (evento) =>{
            this.clickView(evento.target);
        });
    }

    clickView(evento){
        const input = evento.parentElement.querySelector('input');
        const atributoType = input.getAttribute('type');
        if(evento.classList.contains('buttonMostrarSenha')){
            if(atributoType === 'password'){
                input.setAttribute('type', 'text')
                evento.style.backgroundImage = 'url(imagens/bloquear-senha.png)'
            }else{
                input.setAttribute('type', 'password')
                evento.style.backgroundImage = 'url(imagens/mostrar-senha.png)'
            }
        }
    }

    handleSubmit(evento){
        evento.preventDefault();
        const camposValidos = this.camposValidos();
        const senhasValidas = this.senhasValidas();

        if(camposValidos && senhasValidas){
            this.camposValidos();
            this.notificarEnviado();
            setTimeout(() => {this.formulario.submit()}, 3000);
        }
    }

    notificarEnviado(){
        const boxEnviado = document.querySelector('.boxFormularioEnviado')
        boxEnviado.style.display = 'flex';
        setTimeout(() => {
            boxEnviado.style.display = 'none';
        }, 3000);
    }

    senhasValidas(){
        let valida = true;
        const senha = this.formulario.querySelector('.senha');
        const repetirSenha = this.formulario.querySelector('.repetirSenha');

        if(senha.value === '') return;

        if(senha.value !== repetirSenha.value){
            valida = false;
            this.criaErro(repetirSenha, 'Campos senha e repetir senha precisão ser iguais');
        }
        if(senha.value.length < 6 || senha.value.length > 12){
            valida = false;
            this.criaErro(senha, 'Senha precisa ter entre 6 e 12 caracteres.')
        }
        return valida;
    }

    camposValidos(){
        let valida = true;

        for(let erro of this.formulario.querySelectorAll('.erro-texto')){
            erro.remove();
        }

        for(let campo of this.formulario.querySelectorAll('.validar')){
            const label = campo.previousElementSibling.innerText;
            if(!campo.value){
                this.criaErro(campo, `Campo ${label} não pode estar em branco.`);
                valida = false;
            }

            if(campo.classList.contains('cpf')){
                if(!this.validaCPF(campo)) valida = false;
            }
            if(campo.classList.contains('usuario')){
                if(!this.validaUsuario(campo)) valida = false;
            }
        }
        return valida;
    }
    validaUsuario(campo){
        const usuario = campo.value;
        let valida = true;

        if(usuario === '') return;
        if(usuario.length < 3 || usuario.length > 12){
            this.criaErro(campo, 'Usuário precisa ter entre 3 e 12 caracteres.');
            valida = false;
        }
        if(!usuario.match(/^[a-zA-Z0-9]+$/g)){
            this.criaErro(campo, 'Nome de usuário pode ter somente letras e/ou números.');
            valida = false;
        }
        return valida;
    }

    validaCPF(campo){
        const cpf = new ValidaCPF(campo.value);

        if(campo.value === '') return;
        if(!cpf.valida()){
            this.criaErro(campo, 'CPF inválido.');
            return false
        }
        return true
    }

    criaErro(campo, mensagem){
        const div = document.createElement('div');
        div.innerHTML = mensagem;
        div.classList.add('erro-texto');
        campo.insertAdjacentElement('afterend', div);
    }
}

const valida = new ValidaFormulario();