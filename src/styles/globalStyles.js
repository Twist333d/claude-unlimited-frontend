import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Merriweather&family=Roboto:wght@400;700&display=swap');

  body {
    font-family: 'Merriweather', serif;
    font-size: ${props => props.theme.typography.fontSize.base};
    font-weight: ${props => props.theme.typography.fontWeight.normal};
    line-height: 1.6;
    color: ${props => props.theme.colors.oxfordBlue};
    margin: 0;
    padding: 0;
    background-color: ${props => props.theme.colors.white};
  }


  * {
    box-sizing: border-box;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Roboto', sans-serif;
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: ${props => props.theme.typography.fontWeight.bold};
    line-height: 1.25;
  }


  p, ul, ol, pre, table, blockquote {
    margin-top: 0;
    margin-bottom: 16px;
  }

  ul, ol {
    padding-left: 2em;
  }

  img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 16px 0;
  }

  hr {
    height: 1px;
    background-color: #e1e4e8;
    border: none;
    margin: 24px 0;
  }

  blockquote {
    padding: 0 1em;
    color: #6a737d;
    border-left: 0.25em solid #dfe2e5;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    margin-bottom: 16px;
  }

  table th, table td {
    padding: 6px 13px;
    border: 1px solid #dfe2e5;
  }

  table tr:nth-child(2n) {
    background-color: #f6f8fa;
  }

  pre {
    padding: 16px;
    overflow: auto;
    font-size: 85%;
    line-height: 1.45;
    background-color: #f6f8fa;
    border-radius: 3px;
  }

  code {
    padding: 0.2em 0.4em;
    margin: 0;
    font-size: 85%;
    background-color: rgba(27, 31, 35, 0.05);
    border-radius: 3px;
  }
`;

export default GlobalStyle;