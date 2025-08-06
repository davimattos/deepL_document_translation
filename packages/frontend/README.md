# PowerPoint Translator with DeepL

Uma aplicação web moderna para traduzir arquivos PowerPoint usando a API do DeepL.

## 🚀 Funcionalidades

- **Upload Drag & Drop**: Interface intuitiva para carregar arquivos PPT/PPTX
- **Tradução Automática**: Integração direta com a API do DeepL
- **Múltiplos Idiomas**: Suporte para 10+ idiomas de destino
- **Download Instantâneo**: Baixe o arquivo traduzido imediatamente
- **Interface Responsiva**: Funciona perfeitamente em desktop e mobile
- **Indicador de Progresso**: Acompanhe o status da tradução em tempo real

## 🛠️ Tecnologias

- **React 18** com TypeScript
- **Vite** para build e desenvolvimento
- **Tailwind CSS** para estilização
- **Lucide React** para ícones
- **DeepL API** para tradução

## 📋 Pré-requisitos

- Node.js 16+ 
- Chave da API DeepL (gratuita disponível em [deepl.com/pro-api](https://www.deepl.com/pro-api))
- **Importante**: Para usar em produção, você precisará de um proxy CORS próprio ou usar uma solução backend

## 🚀 Como usar

### 1. Clone o repositório
```bash
git clone https://github.com/seu-usuario/ppt-deepl-translator.git
cd ppt-deepl-translator
```

### 2. Instale as dependências
```bash
npm install
```

### 3. Configure a API do DeepL
1. Acesse [DeepL API](https://www.deepl.com/pro-api) e crie uma conta gratuita
2. Copie sua chave da API
3. Cole a chave no campo "Chave da API DeepL" na aplicação

### Nota sobre CORS
Esta aplicação faz chamadas diretas à API do DeepL. Se você encontrar problemas de CORS:
1. Use uma extensão de navegador para desabilitar CORS (apenas para desenvolvimento)
2. Para produção, implemente um backend simples ou use Netlify/Vercel Functions
3. Considere usar um proxy CORS próprio

### 4. Execute o projeto
```bash
npm run dev
```

### 5. Acesse a aplicação
Abra [http://localhost:5173](http://localhost:5173) no seu navegador

## 📖 Como usar a aplicação

1. **Configure a API**: Cole sua chave da API DeepL no campo apropriado
2. **Selecione o idioma**: Escolha o idioma de destino para a tradução
3. **Carregue o arquivo**: Arraste e solte ou clique para selecionar um arquivo PPT/PPTX
4. **Traduza**: Clique em "Traduzir com DeepL" e aguarde o processamento
5. **Download**: Baixe o arquivo traduzido quando estiver pronto

## 🌍 Idiomas Suportados

- Inglês (EN)
- Português (PT)
- Espanhol (ES)
- Francês (FR)
- Alemão (DE)
- Italiano (IT)
- Japonês (JA)
- Coreano (KO)
- Chinês (ZH)
- Russo (RU)

## 🔒 Segurança

- A chave da API é armazenada apenas na sessão do navegador
- Não há armazenamento permanente de dados sensíveis
- Os arquivos são processados diretamente via API DeepL
- **Atenção**: Em produção, considere usar um backend para proteger a chave da API

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a build de produção
- `npm run preview` - Visualiza a build de produção
- `npm run lint` - Executa o linter

## 🤝 Contribuindo

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

## 🆘 Suporte

Se você encontrar algum problema ou tiver dúvidas:

1. **Erro de CORS**: Certifique-se de que o proxy CORS está funcionando
1. Verifique se sua chave da API DeepL está correta
2. Certifique-se de que o arquivo é um PowerPoint válido (.ppt ou .pptx)
3. Verifique sua conexão com a internet
4. Abra uma issue neste repositório

## 🙏 Agradecimentos

- [DeepL](https://www.deepl.com/) pela excelente API de tradução
- [Lucide](https://lucide.dev/) pelos ícones
- [Tailwind CSS](https://tailwindcss.com/) pelo framework CSS