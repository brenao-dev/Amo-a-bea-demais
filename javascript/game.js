/* =========================================================
   PIXELZINHOMAROTO
   GAME.JS  —  matérias, níveis e dificuldade
   ========================================================= */

"use strict";


/* =========================================================
   1. CONFIGURAÇÕES
   ========================================================= */

const TEMPO_FEEDBACK = 2600;

const ACERTO_MINIMO = 0.6;      /* 60% para concluir o nível */

const QUESTOES_POR_RODADA = 8;  /* quantas questões entram em cada partida */

const MUSICA_URL = "audio/tema-inicial.mp3";  /* trilha sonora do jogo */
const MUSICA_QUIZ_URL = "audio/tema-quiz.mp3";  /* trilha tocada durante as perguntas */
const MUSICA_VOLUME = 0.35;

const STORAGE_KEYS = {
    player: "pixelzinho_player",
    progress: "pixelzinho_progress_v2",
    ranking: "pixelzinho_ranking_v2",
    settings: "pixelzinho_settings"
};


const DIFICULDADES = {

    facil: {
        nome: "FÁCIL",
        tempo: 20,
        multiplicador: 1
    },

    medio: {
        nome: "MÉDIO",
        tempo: 15,
        multiplicador: 1.5
    },

    dificil: {
        nome: "DIFÍCIL",
        tempo: 10,
        multiplicador: 2
    }

};


/* =========================================================
   2. BANCO DE QUESTÕES
   -----------------------------------------------------
   Formato compacto:
   p = pergunta
   a = alternativas (A, B, C, D)
   c = índice da correta (0 = A)
   e = explicação
   ========================================================= */

const MATERIAS = {

    matematica: {

        nome: "MATEMÁTICA",
        icone: "📐",

        niveis: [

            {
                id: "aritmetica",
                nome: "ARITMÉTICA",
                icone: "➕",
                questoes: {

                    facil: [
                        { p: "Quanto é 7 + 8?", a: ["13", "14", "15", "16"], c: 2, e: "7 + 8 = 15." },
                        { p: "Quanto é 9 × 6?", a: ["45", "54", "56", "63"], c: 1, e: "9 × 6 = 54." },
                        { p: "Quanto é 45 ÷ 9?", a: ["4", "5", "6", "9"], c: 1, e: "45 ÷ 9 = 5." },
                        { p: "Qual desses números é divisível por 3?", a: ["14", "22", "27", "31"], c: 2, e: "2 + 7 = 9, e 9 é múltiplo de 3." },
                        { p: "Quanto é 12 + 19?", a: ["29", "30", "31", "32"], c: 2, e: "12 + 19 = 31." },
                        { p: "Quanto é 100 − 37?", a: ["57", "63", "67", "73"], c: 1, e: "100 − 37 = 63." },
                        { p: "Quanto é 72 ÷ 8?", a: ["6", "7", "8", "9"], c: 3, e: "8 × 9 = 72, então 72 ÷ 8 = 9." },
                        { p: "Qual é o dobro de 25? (dobro = 2 × n)", a: ["35", "45", "50", "55"], c: 2, e: "2 × 25 = 50." },
                        { p: "Qual desses números é par?", a: ["13", "21", "34", "47"], c: 2, e: "34 termina em 4, logo é par." },
                        { p: "Quanto é 6 × 6 + 4?", a: ["36", "38", "40", "46"], c: 2, e: "Multiplicação primeiro: 36 + 4 = 40." },
                        { p: "Qual é a fórmula da média aritmética de vários números?", a: ["M = soma × quantidade", "M = soma ÷ quantidade", "M = maior ÷ menor", "M = soma − quantidade"], c: 1, e: "A média é a soma dos valores dividida pela quantidade deles." },
                        { p: "Quanto vale a⁰ para a ≠ 0?", a: ["0", "1", "a", "−1"], c: 1, e: "Todo número diferente de zero elevado a zero é igual a 1." },
                        { p: "Qual é o resultado de (−) × (−)?", a: ["+", "−", "0", "Depende"], c: 0, e: "Sinais iguais multiplicados resultam em positivo." }
                    ],

                    medio: [
                        { p: "Quanto é 7 × 13?", a: ["81", "89", "91", "93"], c: 2, e: "7 × 13 = 91." },
                        { p: "Quanto é 2³?", a: ["6", "8", "9", "12"], c: 1, e: "2³ = 2 × 2 × 2 = 8." },
                        { p: "Quanto é (8 + 4) × 3?", a: ["20", "26", "36", "44"], c: 2, e: "Primeiro o parêntese: 12 × 3 = 36." },
                        { p: "Quanto é 144 ÷ 12?", a: ["11", "12", "14", "16"], c: 1, e: "12 × 12 = 144, então 144 ÷ 12 = 12." },
                        { p: "Quanto é 3⁴?", a: ["12", "64", "81", "91"], c: 2, e: "3⁴ = 3 × 3 × 3 × 3 = 81." },
                        { p: "Quanto é 20 − 3 × 4?", a: ["8", "12", "17", "68"], c: 0, e: "Multiplicação vem antes: 20 − 12 = 8." },
                        { p: "Quanto é √81?", a: ["7", "8", "9", "11"], c: 2, e: "9 × 9 = 81, então √81 = 9." },
                        { p: "Quanto é 15 × 12?", a: ["150", "170", "180", "200"], c: 2, e: "15 × 12 = 180." },
                        { p: "Quanto é 250 ÷ 5 + 10?", a: ["50", "55", "60", "70"], c: 2, e: "250 ÷ 5 = 50, e 50 + 10 = 60." },
                        { p: "Qual é a média de 4, 8 e 12? (M = soma ÷ n)", a: ["6", "7", "8", "9"], c: 2, e: "M = (4 + 8 + 12) ÷ 3 = 24 ÷ 3 = 8." },
                        { p: "Qual é a fórmula da multiplicação de potências de mesma base? aᵐ × aⁿ = ?", a: ["aᵐ⁺ⁿ", "aᵐ⁻ⁿ", "aᵐ·ⁿ", "aᵐ/ⁿ"], c: 0, e: "Na multiplicação de potências de mesma base, somam-se os expoentes." },
                        { p: "Qual é a fórmula da divisão de potências de mesma base? aᵐ ÷ aⁿ = ?", a: ["aᵐ⁺ⁿ", "aᵐ⁻ⁿ", "aᵐ·ⁿ", "a^(m/n)"], c: 1, e: "Na divisão de potências de mesma base, subtraem-se os expoentes." },
                        { p: "Qual é a fórmula da potência de uma potência? (aᵐ)ⁿ = ?", a: ["aᵐ⁺ⁿ", "aᵐ⁻ⁿ", "aᵐ·ⁿ", "aᵐ/ⁿ"], c: 2, e: "Na potência de potência, multiplicam-se os expoentes." }
                    ],

                    dificil: [
                        { p: "Qual é o MMC de 6 e 8?", a: ["12", "18", "24", "48"], c: 2, e: "Múltiplos de 8: 8, 16, 24… e 24 também é múltiplo de 6." },
                        { p: "Qual é o MDC de 24 e 36?", a: ["6", "8", "12", "18"], c: 2, e: "O maior divisor comum de 24 e 36 é 12." },
                        { p: "Quanto é 2⁵ − 3²?", a: ["21", "23", "25", "29"], c: 1, e: "2⁵ = 32 e 3² = 9. Então 32 − 9 = 23." },
                        { p: "Quanto é 15² ?", a: ["205", "215", "225", "235"], c: 2, e: "15 × 15 = 225." },
                        { p: "Quanto é 2¹⁰?", a: ["512", "1000", "1024", "2048"], c: 2, e: "2¹⁰ = 1024." },
                        { p: "Quanto é (−5) × (−4) + 3?", a: ["−23", "−17", "17", "23"], c: 3, e: "Sinais iguais dão positivo: (−5) × (−4) = 20, e 20 + 3 = 23." },
                        { p: "Qual é o MMC de 12 e 18?", a: ["24", "30", "36", "72"], c: 2, e: "36 é o menor número que é múltiplo de 12 e de 18." },
                        { p: "Quanto é √144 + √25?", a: ["15", "17", "19", "22"], c: 1, e: "√144 = 12 e √25 = 5. Então 12 + 5 = 17." },
                        { p: "Quanto é 3² × 3³? (aⁿ × aᵐ = aⁿ⁺ᵐ)", a: ["81", "243", "729", "2187"], c: 1, e: "3² × 3³ = 3⁵ = 243." },
                        { p: "Um número dividido por 7 dá 13 e resta 2. Que número é? (N = d·q + r)", a: ["89", "91", "93", "95"], c: 2, e: "N = 7 × 13 + 2 = 91 + 2 = 93." },
                        { p: "Qual é a fórmula da soma dos n primeiros números naturais (1+2+...+n)?", a: ["n(n+1)/2", "n(n−1)/2", "n²/2", "n(n+2)/2"], c: 0, e: "É a soma de Gauss: n(n+1) ÷ 2." },
                        { p: "Qual é a fórmula do número de combinações simples? Cₙ,ₚ = ?", a: ["n! / p!", "n! / (n−p)!", "n! / (p!(n−p)!)", "n! · p!"], c: 2, e: "Cₙ,ₚ = n! ÷ (p! × (n − p)!)." },
                        { p: "Qual é a fórmula do número de arranjos simples? Aₙ,ₚ = ?", a: ["n! / (n−p)!", "n! / p!", "n! / (p!(n−p)!)", "n!"], c: 0, e: "Aₙ,ₚ = n! ÷ (n − p)!." }
                    ]

                }
            },

            {
                id: "fracoes",
                nome: "FRAÇÕES E %",
                icone: "🍕",
                questoes: {

                    facil: [
                        { p: "Quanto é 1/2 + 1/2?", a: ["1/2", "1", "2", "3/2"], c: 1, e: "1/2 + 1/2 = 2/2 = 1." },
                        { p: "Quanto é 10% de 200?", a: ["10", "20", "30", "40"], c: 1, e: "10% de 200 = 0,10 × 200 = 20." },
                        { p: "Quanto é 1/4 de 20?", a: ["4", "5", "6", "10"], c: 1, e: "20 ÷ 4 = 5." },
                        { p: "Qual fração é igual a 0,5?", a: ["1/5", "1/3", "1/2", "2/3"], c: 2, e: "0,5 é metade, ou seja, 1/2." },
                        { p: "Quanto é 3/7 + 2/7?", a: ["5/7", "5/14", "6/7", "1/7"], c: 0, e: "Mesmo denominador: soma só os numeradores → 5/7." },
                        { p: "Quanto é 50% de 60?", a: ["25", "30", "35", "40"], c: 1, e: "50% é a metade: 60 ÷ 2 = 30." },
                        { p: "Qual fração representa 25%?", a: ["1/2", "1/3", "1/4", "1/5"], c: 2, e: "25% = 25/100 = 1/4." },
                        { p: "Quanto é 1/3 de 27?", a: ["6", "9", "12", "13"], c: 1, e: "27 ÷ 3 = 9." },
                        { p: "Quanto é 2/5 em número decimal?", a: ["0,2", "0,4", "0,25", "2,5"], c: 1, e: "2 ÷ 5 = 0,4." },
                        { p: "Quanto é 1 − 1/4?", a: ["1/4", "1/2", "2/3", "3/4"], c: 3, e: "1 = 4/4, então 4/4 − 1/4 = 3/4." },
                        { p: "Qual é a fórmula para calcular X% de um valor V?", a: ["V ÷ 100 × X", "V × 100 ÷ X", "X ÷ V × 100", "V + X ÷ 100"], c: 0, e: "Basta multiplicar o valor pela porcentagem em forma decimal: V × (X/100)." },
                        { p: "Como se transforma uma porcentagem em número decimal?", a: ["Multiplica por 100", "Divide por 100", "Soma 100", "Subtrai 100"], c: 1, e: "Ex.: 25% = 25 ÷ 100 = 0,25." },
                        { p: "Qual é a fórmula para somar frações de denominadores diferentes?", a: ["Somar numeradores e denominadores direto", "Igualar os denominadores (MMC) e somar numeradores", "Multiplicar tudo", "Subtrair os denominadores"], c: 1, e: "Primeiro reduz-se ao mesmo denominador (MMC), depois soma os numeradores." }
                    ],

                    medio: [
                        { p: "Quanto é 2/3 + 1/6?", a: ["3/9", "1/2", "5/6", "7/6"], c: 2, e: "2/3 = 4/6. Então 4/6 + 1/6 = 5/6." },
                        { p: "Quanto é 25% de 80?", a: ["15", "20", "25", "30"], c: 1, e: "25% é um quarto: 80 ÷ 4 = 20." },
                        { p: "Quanto é 3/4 de 40?", a: ["24", "28", "30", "34"], c: 2, e: "40 ÷ 4 = 10, e 10 × 3 = 30." },
                        { p: "Um produto de R$ 80 teve 10% de desconto. Quanto ficou?", a: ["R$ 68", "R$ 70", "R$ 72", "R$ 76"], c: 2, e: "10% de 80 = 8. Então 80 − 8 = 72." },
                        { p: "Quanto é 1/2 × 2/5? (a/b × c/d = a·c / b·d)", a: ["1/5", "2/7", "3/10", "5/4"], c: 0, e: "(1 × 2) / (2 × 5) = 2/10 = 1/5." },
                        { p: "Quanto é 3/4 − 1/2?", a: ["1/4", "1/3", "1/2", "2/3"], c: 0, e: "1/2 = 2/4, então 3/4 − 2/4 = 1/4." },
                        { p: "Quanto é 15% de 300?", a: ["30", "45", "50", "60"], c: 1, e: "0,15 × 300 = 45." },
                        { p: "Quanto 20 representa de 50? (% = parte ÷ todo × 100)", a: ["25%", "30%", "40%", "50%"], c: 2, e: "20 ÷ 50 = 0,4 → 40%." },
                        { p: "Simplifique a fração 18/24.", a: ["2/3", "3/4", "4/5", "5/6"], c: 1, e: "Dividindo os dois por 6: 18/24 = 3/4." },
                        { p: "Uma camisa de R$ 50 subiu 20%. Novo preço? (V = P × 1,20)", a: ["R$ 55", "R$ 58", "R$ 60", "R$ 70"], c: 2, e: "50 × 1,20 = 60." },
                        { p: "Qual é a fórmula de juros simples? J = ?", a: ["J = C × i × t", "J = C × i ÷ t", "J = C + i + t", "J = C ÷ (i × t)"], c: 0, e: "Juros simples: J = Capital × taxa × tempo." },
                        { p: "Qual é a fórmula do montante em juros simples? M = ?", a: ["M = C(1 + i)ᵗ", "M = C(1 + i·t)", "M = C + i", "M = C × i × t"], c: 1, e: "No juros simples, M = C × (1 + i·t)." },
                        { p: "Qual é a fórmula para multiplicar frações? a/b × c/d = ?", a: ["(a+c)/(b+d)", "(a·c)/(b·d)", "(a·d)/(b·c)", "(a−c)/(b−d)"], c: 1, e: "Multiplica-se numerador por numerador e denominador por denominador." }
                    ],

                    dificil: [
                        { p: "Quanto é 3/5 de 250?", a: ["125", "140", "150", "175"], c: 2, e: "250 ÷ 5 = 50, e 50 × 3 = 150." },
                        { p: "Um valor de 150 sofre aumento de 20%. Qual o novo valor?", a: ["165", "170", "175", "180"], c: 3, e: "20% de 150 = 30. Então 150 + 30 = 180." },
                        { p: "Quanto é 2/3 ÷ 4/9?", a: ["2/3", "8/27", "3/2", "1/3"], c: 2, e: "Dividir é multiplicar pelo inverso: 2/3 × 9/4 = 18/12 = 3/2." },
                        { p: "Se 30% de um número é 45, qual é o número?", a: ["120", "135", "150", "165"], c: 2, e: "45 ÷ 0,30 = 150." },
                        { p: "Um preço cai 20% e depois sobe 20%. Em relação ao original ele fica:", a: ["Igual", "4% menor", "4% maior", "20% menor"], c: 1, e: "1 × 0,8 × 1,2 = 0,96, ou seja, 4% menor." },
                        { p: "Quanto é 5/6 − 2/9?", a: ["7/18", "11/18", "13/18", "3/15"], c: 1, e: "MMC 18: 15/18 − 4/18 = 11/18." },
                        { p: "Se 2/5 de um número é 18, qual é o número?", a: ["36", "40", "45", "50"], c: 2, e: "N = 18 ÷ (2/5) = 18 × 5/2 = 45." },
                        { p: "R$ 1000 a 10% ao ano em juros compostos, após 2 anos: (M = C(1+i)ⁿ)", a: ["R$ 1100", "R$ 1200", "R$ 1210", "R$ 1250"], c: 2, e: "M = 1000 × 1,1² = 1000 × 1,21 = 1210." },
                        { p: "Qual é a fração geratriz de 0,333…?", a: ["1/3", "3/10", "1/30", "33/100"], c: 0, e: "0,333… = 3/9 = 1/3." },
                        { p: "Em uma prova, 45 dos 60 alunos passaram. Qual a porcentagem?", a: ["65%", "70%", "75%", "80%"], c: 2, e: "45 ÷ 60 = 0,75 → 75%." },
                        { p: "Qual é a fórmula do montante em juros compostos? M = ?", a: ["M = C(1 + i·t)", "M = C(1 + i)ᵗ", "M = C + i·t", "M = C·i·t"], c: 1, e: "Juros compostos: M = C × (1 + i)ᵗ." },
                        { p: "Qual é a fórmula para dividir frações? a/b ÷ c/d = ?", a: ["(a·c)/(b·d)", "(a·d)/(b·c)", "(a+d)/(b+c)", "(a−d)/(b−c)"], c: 1, e: "Dividir é multiplicar pelo inverso: a/b × d/c." },
                        { p: "Como converter uma dízima periódica simples (0,ababab…) em fração?", a: ["Período sobre um 9 para cada dígito do período", "Período dividido por 10", "Período multiplicado por 9", "10 dividido pelo período"], c: 0, e: "Ex.: 0,4545… = 45/99. O denominador tem um 9 para cada dígito do período." }
                    ]

                }
            },

            {
                id: "algebra",
                nome: "ÁLGEBRA",
                icone: "🔤",
                questoes: {

                    facil: [
                        { p: "Se x = 5, quanto vale x + 7?", a: ["10", "11", "12", "13"], c: 2, e: "Substituindo: 5 + 7 = 12." },
                        { p: "Se x = 3, quanto vale 2x?", a: ["5", "6", "8", "9"], c: 1, e: "2x = 2 × 3 = 6." },
                        { p: "Qual é o valor de x em x + 4 = 10?", a: ["4", "5", "6", "7"], c: 2, e: "x = 10 − 4 = 6." },
                        { p: "Se a = 4 e b = 2, quanto vale a × b?", a: ["6", "8", "10", "12"], c: 1, e: "4 × 2 = 8." },
                        { p: "Se x = 6, quanto vale 3x − 4?", a: ["12", "14", "16", "18"], c: 1, e: "3 × 6 = 18, e 18 − 4 = 14." },
                        { p: "Qual é o valor de x em x − 7 = 3?", a: ["4", "7", "10", "21"], c: 2, e: "x = 3 + 7 = 10." },
                        { p: "Qual é o valor de x em 4x = 20?", a: ["4", "5", "6", "16"], c: 1, e: "x = 20 ÷ 4 = 5." },
                        { p: "Se a = 5, quanto vale a²?", a: ["10", "15", "20", "25"], c: 3, e: "a² = 5 × 5 = 25." },
                        { p: "Simplifique: 7x − 2x", a: ["5", "5x", "9x", "14x"], c: 1, e: "Termos semelhantes: 7x − 2x = 5x." },
                        { p: "Se x = 2 e y = 3, quanto vale x + 2y?", a: ["7", "8", "9", "10"], c: 1, e: "2 + 2 × 3 = 2 + 6 = 8." },
                        { p: "Qual é a fórmula de x em uma equação do 1º grau ax + b = 0?", a: ["x = a/b", "x = −b/a", "x = b/a", "x = −a/b"], c: 1, e: "De ax + b = 0, isolamos x = −b/a." },
                        { p: "Qual é a fórmula do quadrado da soma? (a+b)² = ?", a: ["a² + b²", "a² + 2ab + b²", "a² − 2ab + b²", "a² + ab + b²"], c: 1, e: "(a+b)² = a² + 2ab + b²." },
                        { p: "Qual é a fórmula do quadrado da diferença? (a−b)² = ?", a: ["a² − b²", "a² − 2ab + b²", "a² + 2ab + b²", "a² − ab + b²"], c: 1, e: "(a−b)² = a² − 2ab + b²." }
                    ],

                    medio: [
                        { p: "Qual é o valor de x em 3x − 5 = 16?", a: ["5", "6", "7", "8"], c: 2, e: "3x = 21, então x = 7." },
                        { p: "Qual é o valor de x em 2(x + 3) = 14?", a: ["2", "4", "5", "7"], c: 1, e: "x + 3 = 7, então x = 4." },
                        { p: "Se y = 2x + 1 e x = 4, quanto vale y?", a: ["7", "8", "9", "10"], c: 2, e: "y = 2 × 4 + 1 = 9." },
                        { p: "Simplifique: 3x + 5x", a: ["8", "8x", "15x", "8x²"], c: 1, e: "Termos semelhantes se somam: 3x + 5x = 8x." },
                        { p: "Qual é o valor de x em x/3 + 2 = 6?", a: ["8", "10", "12", "18"], c: 2, e: "x/3 = 4, então x = 12." },
                        { p: "Fatore x² − 16. (a² − b² = (a + b)(a − b))", a: ["(x − 4)²", "(x + 4)²", "(x + 4)(x − 4)", "x(x − 16)"], c: 2, e: "Diferença de quadrados: (x + 4)(x − 4)." },
                        { p: "Se f(x) = 2x + 3, quanto vale f(5)?", a: ["10", "11", "13", "15"], c: 2, e: "f(5) = 2 × 5 + 3 = 13." },
                        { p: "Qual é o valor de x em 5x + 4 = 2x + 19?", a: ["3", "4", "5", "6"], c: 2, e: "3x = 15, então x = 5." },
                        { p: "Simplifique: 2(x + 3) + 4x", a: ["6x + 3", "6x + 6", "8x + 6", "6x + 9"], c: 1, e: "2x + 6 + 4x = 6x + 6." },
                        { p: "Se 3x = 27, quanto vale x + 5?", a: ["9", "12", "14", "32"], c: 2, e: "x = 9, então x + 5 = 14." },
                        { p: "Qual é a fórmula da diferença de quadrados? (a+b)(a−b) = ?", a: ["a² − b²", "a² + b²", "a² − 2ab + b²", "a² + 2ab − b²"], c: 0, e: "(a+b)(a−b) = a² − b²." },
                        { p: "Qual é a fórmula do termo geral de uma PA? aₙ = ?", a: ["a₁ + (n−1)r", "a₁ · rⁿ⁻¹", "a₁ + n·r", "a₁ − (n−1)r"], c: 0, e: "aₙ = a₁ + (n − 1) · r, sendo r a razão." },
                        { p: "Qual é a fórmula do termo geral de uma PG? aₙ = ?", a: ["a₁ + (n−1)q", "a₁ · qⁿ⁻¹", "a₁ + n·q", "a₁ ÷ qⁿ⁻¹"], c: 1, e: "aₙ = a₁ · q^(n−1), sendo q a razão." }
                    ],

                    dificil: [
                        { p: "Qual é a raiz positiva de x² − 9 = 0?", a: ["2", "3", "4", "9"], c: 1, e: "x² = 9, então x = 3 (raiz positiva)." },
                        { p: "Qual é o valor de x em 5x + 2 = 3x + 10?", a: ["2", "3", "4", "6"], c: 2, e: "2x = 8, então x = 4." },
                        { p: "Se x + y = 10 e x − y = 2, quanto vale x?", a: ["4", "5", "6", "8"], c: 2, e: "Somando as equações: 2x = 12, então x = 6." },
                        { p: "Expanda: (x + 2)²", a: ["x² + 4", "x² + 2x + 4", "x² + 4x + 4", "x² + 4x + 2"], c: 2, e: "(x + 2)² = x² + 2·2·x + 4 = x² + 4x + 4." },
                        { p: "Qual é o discriminante de x² − 5x + 6 = 0? (Δ = b² − 4ac)", a: ["1", "2", "5", "25"], c: 0, e: "Δ = (−5)² − 4·1·6 = 25 − 24 = 1." },
                        { p: "Quais são as raízes de x² − 5x + 6 = 0?", a: ["1 e 6", "2 e 3", "−2 e −3", "3 e 4"], c: 1, e: "Soma 5 e produto 6 → raízes 2 e 3." },
                        { p: "Na PA 3, 7, 11, 15… qual é o 10º termo? (aₙ = a₁ + (n − 1)r)", a: ["35", "39", "43", "45"], c: 1, e: "a₁₀ = 3 + 9 × 4 = 39." },
                        { p: "Expanda: (x − 3)²", a: ["x² − 9", "x² − 6x + 9", "x² + 6x + 9", "x² − 3x + 9"], c: 1, e: "(x − 3)² = x² − 2·3·x + 9 = x² − 6x + 9." },
                        { p: "Na PG 2, 6, 18… qual é o 5º termo? (aₙ = a₁ · qⁿ⁻¹)", a: ["54", "108", "162", "216"], c: 2, e: "a₅ = 2 × 3⁴ = 2 × 81 = 162." },
                        { p: "Se x + y = 12 e x · y = 35, quais são x e y?", a: ["3 e 9", "4 e 8", "5 e 7", "6 e 6"], c: 2, e: "5 + 7 = 12 e 5 × 7 = 35." },
                        { p: "Qual é a fórmula de Bhaskara para resolver ax² + bx + c = 0?", a: ["x = (−b ± √Δ) / 2a", "x = (−b ± √Δ) / a", "x = (b ± √Δ) / 2a", "x = (−b ± Δ) / 2a"], c: 0, e: "Fórmula de Bhaskara: x = (−b ± √Δ) ÷ 2a, com Δ = b² − 4ac." },
                        { p: "Qual é a fórmula do discriminante de uma equação do 2º grau? Δ = ?", a: ["b² − 4ac", "b² + 4ac", "b² − 4a", "4ac − b²"], c: 0, e: "Δ = b² − 4ac." },
                        { p: "Qual é a fórmula da soma dos termos de uma PA finita? Sₙ = ?", a: ["Sₙ = (a₁ + aₙ) · n", "Sₙ = (a₁ + aₙ) · n ÷ 2", "Sₙ = a₁ · aₙ ÷ 2", "Sₙ = (a₁ − aₙ) ÷ 2"], c: 1, e: "Sₙ = (a₁ + aₙ) × n ÷ 2." },
                        { p: "Qual é a fórmula da soma dos termos de uma PG infinita (|q| < 1)? S = ?", a: ["S = a₁ ÷ (1 − q)", "S = a₁ × (1 − q)", "S = a₁ ÷ (1 + q)", "S = a₁ · q"], c: 0, e: "S = a₁ ÷ (1 − q), válida quando |q| < 1." }
                    ]

                }
            },

            {
                id: "geometria",
                nome: "GEOMETRIA",
                icone: "📏",
                questoes: {

                    facil: [
                        { p: "Qual é a área de um quadrado de lado 4? (A = L²)", a: ["8", "12", "16", "20"], c: 2, e: "Área = lado², ou seja, 4 × 4 = 16." },
                        { p: "Qual é o perímetro de um retângulo 3 × 5? (P = 2(b + h))", a: ["8", "15", "16", "18"], c: 2, e: "Perímetro = 2 × (3 + 5) = 16." },
                        { p: "Quanto soma os ângulos internos de um triângulo?", a: ["90°", "180°", "270°", "360°"], c: 1, e: "A soma sempre é 180°." },
                        { p: "Quantos lados tem um hexágono?", a: ["5", "6", "7", "8"], c: 1, e: "Hexágono tem 6 lados." },
                        { p: "Área de um retângulo 6 × 4? (A = b × h)", a: ["10", "20", "24", "28"], c: 2, e: "A = 6 × 4 = 24." },
                        { p: "Perímetro de um quadrado de lado 7? (P = 4L)", a: ["14", "21", "28", "49"], c: 2, e: "P = 4 × 7 = 28." },
                        { p: "Quantos graus tem uma volta completa?", a: ["90°", "180°", "270°", "360°"], c: 3, e: "Uma volta completa tem 360°." },
                        { p: "Quantos lados tem um pentágono?", a: ["4", "5", "6", "7"], c: 1, e: "Pentágono tem 5 lados." },
                        { p: "Um triângulo com os três lados iguais é chamado de:", a: ["Escaleno", "Isósceles", "Equilátero", "Retângulo"], c: 2, e: "Três lados iguais = triângulo equilátero." },
                        { p: "O diâmetro de um círculo de raio 5 vale: (d = 2r)", a: ["2,5", "5", "10", "25"], c: 2, e: "d = 2 × 5 = 10." },
                        { p: "Qual é a fórmula da área do quadrado? A = ?", a: ["A = L", "A = L²", "A = 2L", "A = L³"], c: 1, e: "A área do quadrado é o lado ao quadrado: A = L²." },
                        { p: "Qual é a fórmula do perímetro do quadrado? P = ?", a: ["P = L²", "P = 2L", "P = 4L", "P = L/4"], c: 2, e: "P = 4L, soma dos 4 lados iguais." },
                        { p: "Qual é a fórmula da área do retângulo? A = ?", a: ["A = b + h", "A = b × h", "A = 2(b+h)", "A = b/h"], c: 1, e: "A área do retângulo é base vezes altura: A = b × h." }
                    ],

                    medio: [
                        { p: "Área de um triângulo de base 10 e altura 6: (A = b·h ÷ 2)", a: ["20", "30", "40", "60"], c: 1, e: "Área = (base × altura) ÷ 2 = 60 ÷ 2 = 30." },
                        { p: "Volume de um cubo de aresta 3: (V = L³)", a: ["9", "18", "27", "36"], c: 2, e: "Volume = aresta³ = 3 × 3 × 3 = 27." },
                        { p: "Área de um círculo de raio 2 (A = πr², π = 3,14):", a: ["6,28", "9,42", "12,56", "15,70"], c: 2, e: "Área = πr² = 3,14 × 4 = 12,56." },
                        { p: "Um ângulo de 90° é chamado de:", a: ["Agudo", "Reto", "Obtuso", "Raso"], c: 1, e: "O ângulo de 90° é o ângulo reto." },
                        { p: "Comprimento de uma circunferência de raio 3 (C = 2πr, π = 3,14):", a: ["9,42", "18,84", "28,26", "31,40"], c: 1, e: "C = 2 × 3,14 × 3 = 18,84." },
                        { p: "Área de um trapézio de bases 6 e 4 e altura 5: (A = (B + b)·h ÷ 2)", a: ["20", "25", "30", "50"], c: 1, e: "A = (6 + 4) × 5 ÷ 2 = 50 ÷ 2 = 25." },
                        { p: "Área de um losango com diagonais 8 e 6: (A = D·d ÷ 2)", a: ["14", "24", "28", "48"], c: 1, e: "A = 8 × 6 ÷ 2 = 24." },
                        { p: "Soma dos ângulos internos de um quadrilátero:", a: ["180°", "270°", "360°", "540°"], c: 2, e: "(n − 2) × 180° = 2 × 180° = 360°." },
                        { p: "Volume de um paralelepípedo 2 × 3 × 4: (V = a·b·c)", a: ["9", "12", "24", "36"], c: 2, e: "V = 2 × 3 × 4 = 24." },
                        { p: "Em um triângulo, dois ângulos medem 50° e 60°. O terceiro mede:", a: ["60°", "70°", "80°", "90°"], c: 1, e: "180° − (50° + 60°) = 70°." },
                        { p: "Qual é a fórmula da área do triângulo? A = ?", a: ["A = b × h", "A = (b × h) ÷ 2", "A = b + h", "A = 2(b+h)"], c: 1, e: "A = (base × altura) ÷ 2." },
                        { p: "Qual é a fórmula da área do círculo? A = ?", a: ["A = 2πr", "A = πr²", "A = πd", "A = πr"], c: 1, e: "A área do círculo é A = π × r²." },
                        { p: "Qual é a fórmula do comprimento da circunferência? C = ?", a: ["C = πr²", "C = 2πr", "C = πr", "C = 2πr²"], c: 1, e: "C = 2πr (ou πd)." },
                        { p: "Qual é a fórmula do Teorema de Pitágoras?", a: ["a = b + c", "a² = b² + c²", "a² = b² − c²", "a = b² + c²"], c: 1, e: "Em um triângulo retângulo: hipotenusa² = cateto² + cateto²." }
                    ],

                    dificil: [
                        { p: "Um triângulo retângulo tem catetos 3 e 4. Qual é a hipotenusa? (a² = b² + c²)", a: ["5", "6", "7", "12"], c: 0, e: "Pitágoras: 3² + 4² = 25, e √25 = 5." },
                        { p: "Área de um círculo de diâmetro 10 (A = πr², π = 3,14):", a: ["31,4", "62,8", "78,5", "157"], c: 2, e: "Raio = 5, então área = 3,14 × 25 = 78,5." },
                        { p: "Soma dos ângulos internos de um hexágono: (S = (n − 2)·180°)", a: ["540°", "600°", "720°", "900°"], c: 2, e: "(6 − 2) × 180° = 4 × 180° = 720°." },
                        { p: "Volume de um cilindro de raio 2 e altura 5 (V = πr²h, π = 3,14):", a: ["31,4", "62,8", "78,5", "125,6"], c: 1, e: "Volume = πr²h = 3,14 × 4 × 5 = 62,8." },
                        { p: "Diagonal de um quadrado de lado 4: (d = L√2, √2 ≈ 1,41)", a: ["4,24", "5,64", "8,00", "11,30"], c: 1, e: "d = 4 × 1,41 = 5,64." },
                        { p: "Área total da superfície de um cubo de aresta 3: (A = 6L²)", a: ["27", "36", "54", "81"], c: 2, e: "A = 6 × 3² = 6 × 9 = 54." },
                        { p: "Hipotenusa 13 e um cateto 5. O outro cateto vale:", a: ["8", "10", "12", "14"], c: 2, e: "13² − 5² = 169 − 25 = 144, e √144 = 12." },
                        { p: "Volume de uma esfera de raio 3 (V = 4πr³ ÷ 3, π = 3,14):", a: ["37,68", "113,04", "150,72", "339,12"], c: 1, e: "V = 4 × 3,14 × 27 ÷ 3 = 113,04." },
                        { p: "Altura de um triângulo equilátero de lado 6: (h = L√3 ÷ 2, √3 ≈ 1,73)", a: ["3,46", "5,19", "6,92", "10,38"], c: 1, e: "h = 6 × 1,73 ÷ 2 = 5,19." },
                        { p: "Área de um setor de 90° num círculo de raio 4 (π = 3,14):", a: ["6,28", "12,56", "25,12", "50,24"], c: 1, e: "A = πr² × (90/360) = 50,24 ÷ 4 = 12,56." },
                        { p: "Qual é a fórmula do volume do cilindro? V = ?", a: ["V = πr²h", "V = 2πrh", "V = πr³", "V = (4/3)πr³"], c: 0, e: "V = π × r² × h." },
                        { p: "Qual é a fórmula do volume da esfera? V = ?", a: ["V = πr²h", "V = (4/3)πr³", "V = (1/3)πr²h", "V = 4πr²"], c: 1, e: "V = (4/3) × π × r³." },
                        { p: "Qual é a fórmula do volume do cone? V = ?", a: ["V = πr²h", "V = (1/3)πr²h", "V = (4/3)πr³", "V = 2πrh"], c: 1, e: "V = (1/3) × π × r² × h." },
                        { p: "Qual é a Lei dos Cossenos, usada em triângulos quaisquer?", a: ["a² = b² + c² − 2bc·cosA", "a² = b² + c²", "a = b·cosA", "a² = b² + c² + bc"], c: 0, e: "Lei dos Cossenos: a² = b² + c² − 2bc·cos(A)." }
                    ]

                }
            }

        ]

    },


    fisica: {

        nome: "FÍSICA",
        icone: "🚀",

        niveis: [

            {
                id: "unidades",
                nome: "UNIDADES",
                icone: "📊",
                questoes: {

                    facil: [
                        { p: "Qual dessas é uma unidade de velocidade?", a: ["kg", "m/s", "N", "J"], c: 1, e: "Metro por segundo (m/s) mede velocidade." },
                        { p: "Qual é a unidade de força no SI?", a: ["Joule", "Watt", "Newton", "Pascal"], c: 2, e: "A força é medida em newtons (N)." },
                        { p: "Qual é a unidade de tempo no SI?", a: ["Hora", "Minuto", "Segundo", "Dia"], c: 2, e: "A unidade de tempo do SI é o segundo (s)." },
                        { p: "1 km equivale a quantos metros?", a: ["10", "100", "1000", "10000"], c: 2, e: "1 km = 1000 m." },
                        { p: "Qual é a unidade de massa no SI?", a: ["Grama", "Quilograma", "Newton", "Litro"], c: 1, e: "A massa no SI é medida em quilogramas (kg)." },
                        { p: "1 hora tem quantos segundos?", a: ["60", "600", "1800", "3600"], c: 3, e: "60 × 60 = 3600 s." },
                        { p: "Qual é a unidade de temperatura no SI?", a: ["Celsius", "Kelvin", "Fahrenheit", "Joule"], c: 1, e: "No SI a temperatura é medida em kelvin (K)." },
                        { p: "1 metro equivale a quantos centímetros?", a: ["10", "100", "1000", "0,01"], c: 1, e: "1 m = 100 cm." },
                        { p: "Qual dessas é unidade de aceleração?", a: ["m/s", "m/s²", "kg·m", "N/m"], c: 1, e: "Aceleração é variação de velocidade por tempo: m/s²." },
                        { p: "A grandeza medida em litros é:", a: ["Massa", "Volume", "Força", "Tempo"], c: 1, e: "O litro é uma unidade de volume." },
                        { p: "Qual é a fórmula da velocidade média?", a: ["v = Δs × Δt", "v = Δs ÷ Δt", "v = Δt ÷ Δs", "v = Δs + Δt"], c: 1, e: "v = Δs ÷ Δt (espaço percorrido dividido pelo tempo)." },
                        { p: "Qual é a fórmula da densidade? d = ?", a: ["d = m × V", "d = m ÷ V", "d = V ÷ m", "d = m + V"], c: 1, e: "Densidade é massa dividida pelo volume: d = m/V." },
                        { p: "Qual é a fórmula para converter Celsius em Kelvin?", a: ["K = °C + 273", "K = °C − 273", "K = °C × 273", "K = °C ÷ 273"], c: 0, e: "T(K) = θ(°C) + 273." }
                    ],

                    medio: [
                        { p: "Qual é a unidade de energia no SI?", a: ["Newton", "Joule", "Watt", "Ampère"], c: 1, e: "A energia é medida em joules (J)." },
                        { p: "36 km/h equivalem a quantos m/s?", a: ["3,6", "10", "36", "360"], c: 1, e: "Divide-se por 3,6: 36 ÷ 3,6 = 10 m/s." },
                        { p: "Qual é a unidade de potência no SI?", a: ["Joule", "Watt", "Newton", "Volt"], c: 1, e: "A potência é medida em watts (W)." },
                        { p: "Massa e peso são a mesma coisa?", a: ["Sim, sempre", "Não, peso é uma força", "Só na Terra", "Só no vácuo"], c: 1, e: "Massa é medida em kg; peso é força e é medido em newtons." },
                        { p: "54 km/h equivalem a quantos m/s? (÷ 3,6)", a: ["10", "12", "15", "18"], c: 2, e: "54 ÷ 3,6 = 15 m/s." },
                        { p: "Qual é a unidade de pressão no SI? (p = F ÷ A)", a: ["Newton", "Pascal", "Joule", "Watt"], c: 1, e: "A pressão é medida em pascals (Pa)." },
                        { p: "5 m/s equivalem a quantos km/h? (× 3,6)", a: ["15", "18", "20", "25"], c: 1, e: "5 × 3,6 = 18 km/h." },
                        { p: "1 kWh corresponde a quantos joules?", a: ["1000 J", "3600 J", "3,6 × 10⁶ J", "10⁶ J"], c: 2, e: "1 kWh = 1000 W × 3600 s = 3,6 × 10⁶ J." },
                        { p: "Qual é a unidade de carga elétrica no SI?", a: ["Ampère", "Volt", "Coulomb", "Ohm"], c: 2, e: "A carga elétrica é medida em coulombs (C)." },
                        { p: "A densidade (d = m ÷ V) é medida em:", a: ["kg·m³", "kg/m³", "N/m³", "m³/kg"], c: 1, e: "Massa dividida por volume: kg/m³." },
                        { p: "Qual é a fórmula da pressão? p = ?", a: ["p = F × A", "p = F ÷ A", "p = A ÷ F", "p = F + A"], c: 1, e: "Pressão é força dividida pela área: p = F/A." },
                        { p: "Qual é a fórmula geral para converter km/h em m/s?", a: ["m/s = km/h × 3,6", "m/s = km/h ÷ 3,6", "m/s = km/h + 3,6", "m/s = km/h − 3,6"], c: 1, e: "Basta dividir por 3,6." },
                        { p: "Qual é a fórmula da vazão (volume por tempo)? Q = ?", a: ["Q = V ÷ t", "Q = V × t", "Q = t ÷ V", "Q = V + t"], c: 0, e: "Vazão é o volume dividido pelo tempo." }
                    ],

                    dificil: [
                        { p: "72 km/h equivalem a quantos m/s?", a: ["15", "18", "20", "25"], c: 2, e: "72 ÷ 3,6 = 20 m/s." },
                        { p: "1 newton corresponde a:", a: ["kg·m/s", "kg·m/s²", "kg/m·s", "kg·m²/s"], c: 1, e: "Como F = m·a, temos N = kg·m/s²." },
                        { p: "1 watt corresponde a:", a: ["J·s", "J/s", "N·m", "N/s"], c: 1, e: "Potência é energia por tempo: W = J/s." },
                        { p: "Quantos segundos há em 2 horas?", a: ["1200", "3600", "7200", "12000"], c: 2, e: "2 × 3600 = 7200 s." },
                        { p: "1 joule corresponde a:", a: ["N·m", "N/m", "N·s", "kg·m/s"], c: 0, e: "Como W = F·d, temos J = N·m." },
                        { p: "1 pascal equivale a:", a: ["N·m²", "N/m²", "J/m", "kg/m"], c: 1, e: "p = F ÷ A, então Pa = N/m²." },
                        { p: "Quantos minutos há em 1,5 dia?", a: ["1440", "2160", "2880", "3600"], c: 1, e: "1,5 × 24 × 60 = 2160 min." },
                        { p: "Na fórmula Ec = m·v² ÷ 2, as unidades resultam em:", a: ["kg·m/s", "kg·m²/s²", "kg/m·s", "N·s"], c: 1, e: "kg × (m/s)² = kg·m²/s², que é o joule." },
                        { p: "0 °C corresponde a quantos kelvins? (T = θ + 273)", a: ["0 K", "100 K", "273 K", "373 K"], c: 2, e: "T = 0 + 273 = 273 K." },
                        { p: "Qual é a ordem de grandeza da velocidade da luz no vácuo?", a: ["3 × 10⁵ m/s", "3 × 10⁶ m/s", "3 × 10⁸ m/s", "3 × 10¹⁰ m/s"], c: 2, e: "c ≈ 3 × 10⁸ m/s." },
                        { p: "Qual é a fórmula da equação de Einstein que relaciona energia e massa?", a: ["E = mc", "E = mc²", "E = m²c", "E = m ÷ c²"], c: 1, e: "A famosa equação de Einstein: E = m·c²." },
                        { p: "Qual é a fórmula da dilatação linear térmica? ΔL = ?", a: ["ΔL = L₀·α·Δθ", "ΔL = L₀ + α", "ΔL = α ÷ Δθ", "ΔL = L₀ ÷ α"], c: 0, e: "ΔL = L₀ · α · Δθ, sendo α o coeficiente de dilatação linear." },
                        { p: "Qual é a fórmula da Lei de Ohm?", a: ["U = R ÷ i", "U = R × i", "U = R + i", "U = i ÷ R"], c: 1, e: "Lei de Ohm: U = R × i (tensão = resistência × corrente)." }
                    ]

                }
            },

            {
                id: "cinematica",
                nome: "CINEMÁTICA",
                icone: "🏃",
                questoes: {

                    facil: [
                        { p: "Um carro percorre 100 km em 2 h. Qual é a velocidade média? (v = Δs ÷ Δt)", a: ["25 km/h", "40 km/h", "50 km/h", "100 km/h"], c: 2, e: "v = Δs ÷ Δt = 100 ÷ 2 = 50 km/h." },
                        { p: "Uma pessoa percorre 60 m em 10 s. Qual é a velocidade média?", a: ["5 m/s", "6 m/s", "10 m/s", "12 m/s"], c: 1, e: "v = 60 ÷ 10 = 6 m/s." },
                        { p: "Um objeto parado tem velocidade igual a:", a: ["0 m/s", "1 m/s", "10 m/s", "Depende da massa"], c: 0, e: "Parado significa velocidade zero." },
                        { p: "Se um corredor aumenta sua velocidade, ele está:", a: ["Parado", "Freando", "Acelerando", "Em repouso"], c: 2, e: "Aumento de velocidade significa aceleração positiva." },
                        { p: "Na fórmula v = Δs ÷ Δt, o Δs representa:", a: ["O tempo", "O deslocamento", "A massa", "A força"], c: 1, e: "Δs é a variação de posição, ou seja, o deslocamento." },
                        { p: "Um ciclista faz 30 km em 1,5 h. Velocidade média?", a: ["15 km/h", "20 km/h", "25 km/h", "45 km/h"], c: 1, e: "v = 30 ÷ 1,5 = 20 km/h." },
                        { p: "Se a velocidade é constante, o movimento é:", a: ["Uniforme", "Acelerado", "Retardado", "Circular"], c: 0, e: "Velocidade constante = movimento uniforme (MU)." },
                        { p: "Um carro leva 4 h para percorrer 240 km. Velocidade média?", a: ["40 km/h", "50 km/h", "60 km/h", "80 km/h"], c: 2, e: "240 ÷ 4 = 60 km/h." },
                        { p: "Quanto tempo leva para percorrer 100 m a 5 m/s? (Δt = Δs ÷ v)", a: ["10 s", "15 s", "20 s", "25 s"], c: 2, e: "Δt = 100 ÷ 5 = 20 s." },
                        { p: "A trajetória de um corpo em queda livre é:", a: ["Circular", "Retilínea vertical", "Parabólica", "Espiral"], c: 1, e: "Ele cai em linha reta na vertical." },
                        { p: "Qual é a fórmula da função horária da posição no MU?", a: ["S = S₀ + v·t", "S = S₀ − v·t", "S = v ÷ t", "S = v × t²"], c: 0, e: "No Movimento Uniforme: S = S₀ + v · t." },
                        { p: "Qual é a fórmula da aceleração média?", a: ["a = Δv × Δt", "a = Δv ÷ Δt", "a = Δt ÷ Δv", "a = Δv + Δt"], c: 1, e: "a = Δv ÷ Δt (variação da velocidade sobre o tempo)." },
                        { p: "Qual é a fórmula do deslocamento no MU? Δs = ?", a: ["Δs = v ÷ Δt", "Δs = v × Δt", "Δs = v + Δt", "Δs = v²·Δt"], c: 1, e: "Δs = v × Δt." }
                    ],

                    medio: [
                        { p: "Um corpo se move a 20 m/s por 5 s. Qual distância percorre?", a: ["25 m", "40 m", "100 m", "400 m"], c: 2, e: "Δs = v × Δt = 20 × 5 = 100 m." },
                        { p: "Um carro vai de 0 a 20 m/s em 4 s. Qual é a aceleração? (a = Δv ÷ Δt)", a: ["2 m/s²", "4 m/s²", "5 m/s²", "80 m/s²"], c: 2, e: "a = Δv ÷ Δt = 20 ÷ 4 = 5 m/s²." },
                        { p: "No movimento uniforme (MU), a velocidade é:", a: ["Sempre zero", "Constante", "Sempre crescente", "Sempre decrescente"], c: 1, e: "No MU a velocidade não muda com o tempo." },
                        { p: "Um trem a 90 km/h viaja por 0,5 h. Qual distância percorre?", a: ["30 km", "45 km", "60 km", "90 km"], c: 1, e: "Δs = 90 × 0,5 = 45 km." },
                        { p: "Um móvel a 15 m/s freia até parar em 3 s. Aceleração?", a: ["−3 m/s²", "−5 m/s²", "−15 m/s²", "5 m/s²"], c: 1, e: "a = (0 − 15) ÷ 3 = −5 m/s²." },
                        { p: "Na função horária s = s₀ + v·t, o s₀ representa:", a: ["A velocidade", "A posição inicial", "O tempo", "A aceleração"], c: 1, e: "s₀ é a posição no instante t = 0." },
                        { p: "Um corpo parte de 10 m/s e acelera 2 m/s² por 5 s. (v = v₀ + a·t)", a: ["12 m/s", "15 m/s", "20 m/s", "25 m/s"], c: 2, e: "v = 10 + 2 × 5 = 20 m/s." },
                        { p: "Dois carros a 60 km/h e 40 km/h se aproximam. Velocidade relativa?", a: ["20 km/h", "50 km/h", "100 km/h", "120 km/h"], c: 2, e: "Na aproximação as velocidades se somam: 100 km/h." },
                        { p: "Em um gráfico v × t, a área sob a curva representa:", a: ["A aceleração", "O deslocamento", "A massa", "A força"], c: 1, e: "Área = velocidade × tempo = deslocamento." },
                        { p: "Quanto tempo um objeto leva para cair 20 m? (h = g·t² ÷ 2, g = 10)", a: ["1 s", "2 s", "3 s", "4 s"], c: 1, e: "20 = 5t² → t² = 4 → t = 2 s." },
                        { p: "Qual é a fórmula da função horária da velocidade no MUV?", a: ["v = v₀ + a·t", "v = v₀ − a", "v = v₀ × t", "v = a ÷ t"], c: 0, e: "No Movimento Uniformemente Variado: v = v₀ + a · t." },
                        { p: "Qual é a fórmula da função horária da posição no MUV?", a: ["S = S₀ + v₀t + (a·t²)/2", "S = S₀ + v₀t", "S = a·t²", "S = S₀ − v₀t + a·t"], c: 0, e: "S = S₀ + v₀·t + (a·t²) ÷ 2." },
                        { p: "Qual é a fórmula da equação de Torricelli?", a: ["v² = v₀² + 2a·Δs", "v = v₀ + 2a·Δs", "v² = v₀ + a²·Δs", "v² = v₀² − a·Δs"], c: 0, e: "Torricelli: v² = v₀² + 2 · a · Δs." }
                    ],

                    dificil: [
                        { p: "Em queda livre (g = 10 m/s²), qual a velocidade após 2 s? (v = g·t)", a: ["5 m/s", "10 m/s", "20 m/s", "40 m/s"], c: 2, e: "v = g × t = 10 × 2 = 20 m/s." },
                        { p: "Se s = 5 + 3t (SI), qual é a posição em t = 4 s?", a: ["12 m", "15 m", "17 m", "20 m"], c: 2, e: "s = 5 + 3 × 4 = 17 m." },
                        { p: "Um corpo parte do repouso com a = 2 m/s². Quanto anda em 3 s?", a: ["6 m", "9 m", "12 m", "18 m"], c: 1, e: "Δs = a·t² ÷ 2 = 2 × 9 ÷ 2 = 9 m." },
                        { p: "Na equação de Torricelli, v² = v₀² + 2aΔs, ela não depende de:", a: ["Velocidade inicial", "Aceleração", "Tempo", "Deslocamento"], c: 2, e: "Torricelli é usada justamente quando o tempo não é conhecido." },
                        { p: "Queda livre a partir do repouso: altura após 3 s? (h = g·t² ÷ 2, g = 10)", a: ["15 m", "30 m", "45 m", "90 m"], c: 2, e: "h = 10 × 9 ÷ 2 = 45 m." },
                        { p: "Um corpo a 20 m/s freia a 4 m/s². Distância até parar? (Torricelli)", a: ["25 m", "50 m", "80 m", "100 m"], c: 1, e: "0 = 400 − 2 × 4 × Δs → Δs = 50 m." },
                        { p: "Em s = 10 + 4t + t² (SI), a aceleração vale: (s = s₀ + v₀t + a·t² ÷ 2)", a: ["1 m/s²", "2 m/s²", "4 m/s²", "10 m/s²"], c: 1, e: "a·t² ÷ 2 = t², logo a = 2 m/s²." },
                        { p: "Objeto lançado para cima a 30 m/s (g = 10). Tempo até a altura máxima?", a: ["1 s", "2 s", "3 s", "6 s"], c: 2, e: "t = v₀ ÷ g = 30 ÷ 10 = 3 s." },
                        { p: "No movimento circular, período T e frequência f se relacionam por:", a: ["T = f", "T = 1 ÷ f", "T = 2f", "T = f²"], c: 1, e: "T e f são inversos: T = 1/f." },
                        { p: "Velocidade angular de um corpo com T = 2 s: (ω = 2π ÷ T)", a: ["π rad/s", "2π rad/s", "4π rad/s", "π/2 rad/s"], c: 0, e: "ω = 2π ÷ 2 = π rad/s." },
                        { p: "Qual é a fórmula da velocidade angular?", a: ["ω = θ × t", "ω = θ ÷ t", "ω = 2π × T", "ω = t ÷ θ"], c: 1, e: "ω = Δθ ÷ Δt (ângulo percorrido sobre o tempo)." },
                        { p: "Qual é a fórmula que relaciona velocidade linear e angular?", a: ["v = ω ÷ r", "v = ω × r", "v = ω + r", "v = ω² × r"], c: 1, e: "v = ω · r, sendo r o raio da trajetória." },
                        { p: "Qual é a fórmula da aceleração centrípeta?", a: ["ac = v² ÷ r", "ac = v ÷ r²", "ac = v × r", "ac = v² × r"], c: 0, e: "ac = v² ÷ r (aceleração centrípeta)." }
                    ]

                }
            },

            {
                id: "forcas",
                nome: "FORÇAS",
                icone: "💪",
                questoes: {

                    facil: [
                        { p: "A Segunda Lei de Newton é escrita como:", a: ["F = m ÷ a", "F = m × a", "F = a ÷ m", "F = m + a"], c: 1, e: "Força resultante = massa × aceleração." },
                        { p: "O peso de um corpo depende de:", a: ["Cor", "Gravidade", "Volume", "Temperatura"], c: 1, e: "Peso = massa × gravidade, então depende de g." },
                        { p: "A força de atrito atua:", a: ["A favor do movimento", "Contra o movimento", "Para cima", "Só no vácuo"], c: 1, e: "O atrito se opõe ao movimento relativo." },
                        { p: "Um corpo em repouso tende a continuar em repouso. Isso é a:", a: ["1ª Lei de Newton", "2ª Lei de Newton", "3ª Lei de Newton", "Lei de Ohm"], c: 0, e: "É o princípio da inércia, a 1ª Lei de Newton." },
                        { p: "A unidade newton pode ser escrita como:", a: ["kg·m/s²", "kg/m", "J/s", "m/s²"], c: 0, e: "De F = m·a vem N = kg·m/s²." },
                        { p: "A fórmula do peso é:", a: ["P = m ÷ g", "P = m · g", "P = g ÷ m", "P = m + g"], c: 1, e: "Peso é massa vezes gravidade: P = m·g." },
                        { p: "Quando você empurra uma parede, ela:", a: ["Não reage", "Empurra você de volta", "Perde massa", "Acelera"], c: 1, e: "3ª Lei de Newton: toda ação gera reação igual e oposta." },
                        { p: "Um livro parado sobre a mesa recebe dela a força:", a: ["Peso", "Normal", "Atrito", "Elétrica"], c: 1, e: "A mesa aplica a força normal, perpendicular à superfície." },
                        { p: "A inércia de um corpo está ligada à sua:", a: ["Cor", "Massa", "Altura", "Velocidade"], c: 1, e: "Quanto maior a massa, maior a inércia." },
                        { p: "A força elástica de uma mola é dada pela Lei de Hooke:", a: ["F = m·a", "F = k·x", "F = m·g", "F = p·A"], c: 1, e: "Lei de Hooke: F = k·x, sendo k a constante da mola." },
                        { p: "Qual é a fórmula da Segunda Lei de Newton?", a: ["F = m ÷ a", "F = m × a", "F = m + a", "F = a ÷ m"], c: 1, e: "F = m × a (força resultante = massa vezes aceleração)." },
                        { p: "Qual é a fórmula do peso de um corpo?", a: ["P = m ÷ g", "P = m × g", "P = m + g", "P = g ÷ m"], c: 1, e: "P = m × g." },
                        { p: "Qual é a fórmula da Lei de Hooke (força elástica)?", a: ["F = k ÷ x", "F = k × x", "F = k + x", "F = x ÷ k"], c: 1, e: "F = k × x, sendo k a constante elástica da mola." }
                    ],

                    medio: [
                        { p: "Qual força acelera um corpo de 10 kg a 2 m/s²?", a: ["5 N", "12 N", "20 N", "100 N"], c: 2, e: "F = 10 × 2 = 20 N." },
                        { p: "Qual é o peso de 5 kg na Terra (g = 10 m/s²)?", a: ["0,5 N", "5 N", "15 N", "50 N"], c: 3, e: "P = m × g = 5 × 10 = 50 N." },
                        { p: "Ação e reação é a:", a: ["1ª Lei", "2ª Lei", "3ª Lei", "Lei da gravidade"], c: 2, e: "A 3ª Lei de Newton trata de pares de ação e reação." },
                        { p: "Se a força resultante é zero, o corpo:", a: ["Para de existir", "Mantém sua velocidade", "Sempre acelera", "Sempre para"], c: 1, e: "Sem força resultante não há aceleração: a velocidade se mantém." },
                        { p: "Mola de k = 100 N/m esticada 0,2 m. Força elástica? (F = k·x)", a: ["2 N", "20 N", "50 N", "200 N"], c: 1, e: "F = 100 × 0,2 = 20 N." },
                        { p: "Um corpo de 4 kg sofre força resultante de 12 N. Aceleração?", a: ["2 m/s²", "3 m/s²", "4 m/s²", "48 m/s²"], c: 1, e: "a = F ÷ m = 12 ÷ 4 = 3 m/s²." },
                        { p: "A força de atrito é calculada por:", a: ["Fat = μ · N", "Fat = m · g", "Fat = k · x", "Fat = F ÷ A"], c: 0, e: "Fat = μ·N, com μ o coeficiente de atrito e N a normal." },
                        { p: "Bloco de 10 kg numa superfície com μ = 0,2 (g = 10). Atrito?", a: ["2 N", "10 N", "20 N", "100 N"], c: 2, e: "N = 100 N, então Fat = 0,2 × 100 = 20 N." },
                        { p: "Duas forças perpendiculares de 6 N e 8 N resultam em: (R = √(F₁² + F₂²))", a: ["10 N", "12 N", "14 N", "48 N"], c: 0, e: "R = √(36 + 64) = √100 = 10 N." },
                        { p: "Qual é a massa de um corpo cujo peso é 300 N (g = 10)? (m = P ÷ g)", a: ["3 kg", "30 kg", "300 kg", "3000 kg"], c: 1, e: "m = 300 ÷ 10 = 30 kg." },
                        { p: "Qual é a fórmula da força de atrito?", a: ["Fat = μ × N", "Fat = μ ÷ N", "Fat = μ + N", "Fat = N ÷ μ"], c: 0, e: "Fat = μ × N, sendo μ o coeficiente de atrito e N a normal." },
                        { p: "Qual é a fórmula do impulso de uma força?", a: ["I = F × Δt", "I = F ÷ Δt", "I = F + Δt", "I = Δt ÷ F"], c: 0, e: "I = F × Δt." },
                        { p: "Qual é a fórmula da quantidade de movimento?", a: ["Q = m ÷ v", "Q = m × v", "Q = m + v", "Q = v ÷ m"], c: 1, e: "Q = m × v." }
                    ],

                    dificil: [
                        { p: "Uma força de 50 N atua sobre 10 kg. Qual é a aceleração?", a: ["2 m/s²", "5 m/s²", "10 m/s²", "500 m/s²"], c: 1, e: "a = F ÷ m = 50 ÷ 10 = 5 m/s²." },
                        { p: "Um corpo de 2 kg cai com g = 10 m/s². Qual é seu peso?", a: ["0,2 N", "2 N", "12 N", "20 N"], c: 3, e: "P = 2 × 10 = 20 N." },
                        { p: "Na Lua a gravidade é menor. O que muda em um astronauta?", a: ["A massa", "O peso", "Os dois", "Nenhum"], c: 1, e: "A massa é a mesma; o peso diminui porque g diminui." },
                        { p: "Duas forças de 30 N e 20 N em sentidos opostos resultam em:", a: ["10 N", "50 N", "600 N", "0 N"], c: 0, e: "Sentidos opostos se subtraem: 30 − 20 = 10 N." },
                        { p: "Elevador sobe a 2 m/s² com pessoa de 60 kg (g = 10). Normal? (N = m(g + a))", a: ["480 N", "600 N", "720 N", "1200 N"], c: 2, e: "N = 60 × (10 + 2) = 720 N." },
                        { p: "Pressão de uma força de 200 N sobre 0,5 m²? (p = F ÷ A)", a: ["100 Pa", "200 Pa", "400 Pa", "1000 Pa"], c: 2, e: "p = 200 ÷ 0,5 = 400 Pa." },
                        { p: "Em F = G·M·m ÷ d², se a distância dobra, a força:", a: ["Dobra", "Cai à metade", "Cai a 1/4", "Quadruplica"], c: 2, e: "A força é inversamente proporcional a d², então cai a 1/4." },
                        { p: "Bloco de 5 kg num plano de 30° (g = 10). Px? (Px = m·g·sen θ)", a: ["12,5 N", "25 N", "43 N", "50 N"], c: 1, e: "Px = 5 × 10 × 0,5 = 25 N." },
                        { p: "Impulso de uma força de 10 N durante 4 s: (I = F · Δt)", a: ["2,5 N·s", "14 N·s", "40 N·s", "400 N·s"], c: 2, e: "I = 10 × 4 = 40 N·s." },
                        { p: "Quantidade de movimento de 3 kg a 4 m/s: (Q = m · v)", a: ["7 kg·m/s", "12 kg·m/s", "24 kg·m/s", "0,75 kg·m/s"], c: 1, e: "Q = 3 × 4 = 12 kg·m/s." },
                        { p: "Qual é a fórmula da Lei da Gravitação Universal?", a: ["F = G × M × m ÷ d²", "F = G × M × m × d²", "F = G ÷ (M×m×d²)", "F = G × (M+m) ÷ d"], c: 0, e: "F = G · M · m ÷ d², sendo G a constante gravitacional." },
                        { p: "Qual é a fórmula da resultante de duas forças perpendiculares?", a: ["R = F₁ + F₂", "R = √(F₁² + F₂²)", "R = F₁ × F₂", "R = F₁ − F₂"], c: 1, e: "Pelo Teorema de Pitágoras: R = √(F₁² + F₂²)." },
                        { p: "Qual é a fórmula da conservação da quantidade de movimento numa colisão?", a: ["m₁v₁ + m₂v₂ = m₁v₁\u2032 + m₂v₂\u2032", "m₁v₁ = m₂v₂", "m₁ + v₁ = m₂ + v₂", "m₁v₁² = m₂v₂²"], c: 0, e: "A quantidade de movimento total se conserva na colisão." }
                    ]

                }
            },

            {
                id: "energia",
                nome: "ENERGIA",
                icone: "⚡",
                questoes: {

                    facil: [
                        { p: "A energia cinética depende principalmente de:", a: ["Cor", "Velocidade", "Temperatura", "Formato"], c: 1, e: "Ec = m·v² ÷ 2, então depende da massa e da velocidade." },
                        { p: "A energia potencial gravitacional depende de:", a: ["Altura", "Cor", "Tempo", "Som"], c: 0, e: "Ep = m·g·h, então depende da altura." },
                        { p: "Qual é a unidade de trabalho e energia?", a: ["Newton", "Joule", "Watt", "Kelvin"], c: 1, e: "Ambos são medidos em joules (J)." },
                        { p: "Um corpo parado no chão tem energia cinética igual a:", a: ["Zero", "Máxima", "Metade", "Infinita"], c: 0, e: "Sem velocidade não há energia cinética." },
                        { p: "A fórmula da energia cinética é:", a: ["Ec = m·v² ÷ 2", "Ec = m·g·h", "Ec = F·d", "Ec = P·t"], c: 0, e: "Ec = m·v² ÷ 2." },
                        { p: "A fórmula da energia potencial gravitacional é:", a: ["Ep = m·v² ÷ 2", "Ep = m·g·h", "Ep = k·x", "Ep = W ÷ t"], c: 1, e: "Ep = m·g·h." },
                        { p: "O trabalho de uma força é dado por:", a: ["W = F · d", "W = m · a", "W = P ÷ t", "W = m · g"], c: 0, e: "W = F·d (força vezes deslocamento)." },
                        { p: "Quanto maior a altura de um corpo, maior sua:", a: ["Energia potencial", "Massa", "Cor", "Temperatura"], c: 0, e: "Ep = m·g·h cresce junto com a altura." },
                        { p: "A potência mede:", a: ["Energia por tempo", "Força por massa", "Massa por volume", "Tempo por energia"], c: 0, e: "P = W ÷ t, ou seja, energia por tempo." },
                        { p: "A energia mecânica é a soma de:", a: ["Ec + Ep", "Ec − Ep", "Ec × Ep", "Apenas Ec"], c: 0, e: "Em = Ec + Ep." },
                        { p: "Qual é a fórmula da energia cinética?", a: ["Ec = m × v ÷ 2", "Ec = m × v² ÷ 2", "Ec = m² × v ÷ 2", "Ec = m × v²"], c: 1, e: "Ec = m·v² ÷ 2." },
                        { p: "Qual é a fórmula da energia potencial gravitacional?", a: ["Ep = m × g ÷ h", "Ep = m × g × h", "Ep = m + g + h", "Ep = g × h ÷ m"], c: 1, e: "Ep = m · g · h." },
                        { p: "Qual é a fórmula do trabalho de uma força?", a: ["W = F ÷ d", "W = F × d", "W = F + d", "W = d ÷ F"], c: 1, e: "W = F × d." }
                    ],

                    medio: [
                        { p: "Ec de um corpo de 2 kg a 3 m/s:", a: ["3 J", "6 J", "9 J", "18 J"], c: 2, e: "Ec = (2 × 3²) ÷ 2 = 18 ÷ 2 = 9 J." },
                        { p: "Ep de 2 kg a 5 m de altura (g = 10):", a: ["10 J", "50 J", "100 J", "200 J"], c: 2, e: "Ep = 2 × 10 × 5 = 100 J." },
                        { p: "Trabalho de uma força de 10 N ao longo de 3 m:", a: ["3 J", "13 J", "30 J", "300 J"], c: 2, e: "W = F × d = 10 × 3 = 30 J." },
                        { p: "Ao cair, a energia potencial de um corpo se transforma em:", a: ["Energia sonora", "Energia cinética", "Energia elétrica", "Massa"], c: 1, e: "Na queda, Ep vira Ec." },
                        { p: "Ec de um corpo de 10 kg a 2 m/s:", a: ["10 J", "20 J", "40 J", "100 J"], c: 1, e: "Ec = 10 × 4 ÷ 2 = 20 J." },
                        { p: "Ep de 5 kg a 4 m de altura (g = 10):", a: ["20 J", "50 J", "100 J", "200 J"], c: 3, e: "Ep = 5 × 10 × 4 = 200 J." },
                        { p: "Um motor realiza 600 J em 10 s. Potência? (P = W ÷ t)", a: ["6 W", "60 W", "600 W", "6000 W"], c: 1, e: "P = 600 ÷ 10 = 60 W." },
                        { p: "Trabalho de 20 N ao longo de 5 m no sentido do movimento:", a: ["4 J", "25 J", "100 J", "400 J"], c: 2, e: "W = 20 × 5 = 100 J." },
                        { p: "Energia de uma mola k = 200 N/m com x = 0,1 m: (E = k·x² ÷ 2)", a: ["0,1 J", "1 J", "2 J", "10 J"], c: 1, e: "E = 200 × 0,01 ÷ 2 = 1 J." },
                        { p: "Uma lâmpada de 60 W fica ligada 2 h. Energia consumida? (E = P·t)", a: ["30 Wh", "60 Wh", "120 Wh", "3600 Wh"], c: 2, e: "E = 60 × 2 = 120 Wh." },
                        { p: "Qual é a fórmula da potência?", a: ["P = W × t", "P = W ÷ t", "P = t ÷ W", "P = W + t"], c: 1, e: "P = W ÷ t (trabalho/energia dividido pelo tempo)." },
                        { p: "Qual é a fórmula da energia potencial elástica?", a: ["Ee = k × x² ÷ 2", "Ee = k × x ÷ 2", "Ee = k² × x ÷ 2", "Ee = k × x²"], c: 0, e: "Ee = k·x² ÷ 2." },
                        { p: "Qual é a fórmula do rendimento de uma máquina?", a: ["η = útil ÷ total", "η = total ÷ útil", "η = útil × total", "η = útil − total"], c: 0, e: "η = energia útil ÷ energia total, geralmente em %." }
                    ],

                    dificil: [
                        { p: "Ec de um corpo de 4 kg a 5 m/s:", a: ["20 J", "50 J", "100 J", "200 J"], c: 1, e: "Ec = (4 × 25) ÷ 2 = 50 J." },
                        { p: "Uma máquina realiza 200 J em 4 s. Qual é a potência?", a: ["4 W", "50 W", "200 W", "800 W"], c: 1, e: "P = W ÷ t = 200 ÷ 4 = 50 W." },
                        { p: "Se a velocidade dobra, a energia cinética:", a: ["Dobra", "Triplica", "Quadruplica", "Não muda"], c: 2, e: "Ec depende de v², então dobrar v multiplica Ec por 4." },
                        { p: "Em um sistema sem atrito, a energia mecânica total:", a: ["Aumenta", "Diminui", "Se conserva", "Vira zero"], c: 2, e: "Sem dissipação, a energia mecânica se conserva." },
                        { p: "Corpo de 2 kg cai de 20 m (g = 10). Velocidade no solo? (m·g·h = m·v² ÷ 2)", a: ["10 m/s", "20 m/s", "30 m/s", "40 m/s"], c: 1, e: "v = √(2 × 10 × 20) = √400 = 20 m/s." },
                        { p: "Máquina recebe 500 J e entrega 400 J. Rendimento? (η = útil ÷ total)", a: ["60%", "70%", "80%", "90%"], c: 2, e: "400 ÷ 500 = 0,8 → 80%." },
                        { p: "Guindaste ergue 100 kg a 5 m em 10 s (g = 10). Potência?", a: ["50 W", "250 W", "500 W", "5000 W"], c: 2, e: "W = 100 × 10 × 5 = 5000 J, e P = 5000 ÷ 10 = 500 W." },
                        { p: "Se a massa dobra e a velocidade não muda, a Ec:", a: ["Não muda", "Dobra", "Quadruplica", "Cai à metade"], c: 1, e: "Ec é proporcional à massa, então dobra." },
                        { p: "Calor para aquecer 200 g de água em 10 °C (c = 1 cal/g°C): (Q = m·c·Δθ)", a: ["200 cal", "1000 cal", "2000 cal", "20000 cal"], c: 2, e: "Q = 200 × 1 × 10 = 2000 cal." },
                        { p: "Numa colisão perfeitamente elástica conservam-se:", a: ["Só a quantidade de movimento", "Só a energia", "Quantidade de movimento e energia cinética", "Nenhuma das duas"], c: 2, e: "Na colisão elástica Q e Ec se conservam." },
                        { p: "Qual é a fórmula do calor sensível?", a: ["Q = m × c × Δθ", "Q = m ÷ c ÷ Δθ", "Q = m + c + Δθ", "Q = c × Δθ ÷ m"], c: 0, e: "Q = m · c · Δθ, sendo c o calor específico." },
                        { p: "Qual é a fórmula da Primeira Lei da Termodinâmica?", a: ["ΔU = Q − W", "ΔU = Q + W", "ΔU = Q × W", "ΔU = Q ÷ W"], c: 0, e: "ΔU = Q − W (variação da energia interna = calor menos trabalho)." },
                        { p: "Qual é a fórmula geral da energia mecânica total?", a: ["Em = Ec − Ep", "Em = Ec + Ep", "Em = Ec × Ep", "Em = Ec ÷ Ep"], c: 1, e: "Em = Ec + Ep (energia cinética mais potencial)." }
                    ]

                }
            }

        ]

    },

    bea: {
        nome: "BEA",
        icone: "💗",
        especial: true,

        niveis: [

            {
                id: "conhece-bea",
                nome: "VOCÊ CONHECE A BEA?",
                icone: "💗",

                questoes: {

                    facil: [
                        {
                            p: "Qual é a banda favorita da BEA?",
                            a: [
                                "Fleetwood Mac",
                                "The Beatles",
                                "Queen",
                                "ABBA"
                            ],
                            c: 0,
                            e: "A banda favorita da BEA é Fleetwood Mac."
                        },

                        {
                            p: "Além de Fleetwood Mac, qual dessas bandas a BEA também ama?",
                            a: [
                                "AC/DC",
                                "Coldplay",
                                "Nirvana",
                                "Metallica"
                            ],
                            c: 0,
                            e: "A BEA também ama AC/DC."
                        },

                        {
                            p: "Qual é o jogo favorito da BEA?",
                            a: [
                                "The Sims",
                                "Minecraft",
                                "Roblox",
                                "Fortnite"
                            ],
                            c: 0,
                            e: "O jogo favorito da BEA é The Sims."
                        },

                        {
                            p: "Qual é o grupo de K-pop favorito da BEA?",
                            a: [
                                "Dreamcatcher",
                                "BLACKPINK",
                                "TWICE",
                                "NewJeans"
                            ],
                            c: 0,
                            e: "O grupo de K-pop favorito da BEA é Dreamcatcher."
                        }
                    ],

                    medio: [
                        {
                            p: "Qual série a BEA está assistindo?",
                            a: [
                                "Criminal Minds",
                                "Friends",
                                "The Office",
                                "Grey's Anatomy"
                            ],
                            c: 0,
                            e: "A BEA está assistindo Criminal Minds."
                        },

                        {
                            p: "Onde vocês se conheceram de fato?",
                            a: [
                                "Pão de Açúcar, no Rio de Janeiro",
                                "Parque Madureira",
                                "Praia de Copacabana",
                                "Shopping"
                            ],
                            c: 0,
                            e: "Vocês se conheceram de fato no Pão de Açúcar, no Rio de Janeiro."
                        },

                        {
                            p: "Qual foi a primeira coisa que a BEA perguntou quando começou a falar com você?",
                            a: [
                                "Se você morava na Cerâmica",
                                "Se você gostava de futebol",
                                "Se você estudava perto dela",
                                "Se você gostava de música"
                            ],
                            c: 0,
                            e: "Ela perguntou se você morava na Cerâmica, bairro de Nova Iguaçu."
                        }
                    ],

                    dificil: [
                        {
                            p: "Onde foi o primeiro encontro de vocês?",
                            a: [
                                "Na casa dela",
                                "No cinema",
                                "No shopping",
                                "No Pão de Açúcar"
                            ],
                            c: 0,
                            e: "O primeiro encontro de vocês foi na casa dela."
                        },

                        {
                            p: "Qual comida/bebida acabou virando uma marca registrada de vocês?",
                            a: [
                                "Açaí",
                                "Pizza",
                                "Hambúrguer",
                                "Milk-shake"
                            ],
                            c: 0,
                            e: "Vocês tomaram/comeram açaí no primeiro encontro, e ele acabou virando uma marca registrada de vocês."
                        }
                    ]
                }
            },

            {
                id: "conhece-nos",
                nome: "VOCÊ CONHECE NÓS DOIS?",
                icone: "💕",

                questoes: {

                    facil: [
                        {
                            p: "O que vocês comeram no primeiro encontro?",
                            a: [
                                "Açaí",
                                "Pizza",
                                "Pastel",
                                "Hambúrguer"
                            ],
                            c: 0,
                            e: "Vocês comeram açaí no primeiro encontro."
                        },

                        {
                            p: "Qual lugar está ligado ao momento em que vocês se conheceram de fato?",
                            a: [
                                "Pão de Açúcar",
                                "Cristo Redentor",
                                "Maracanã",
                                "Ipanema"
                            ],
                            c: 0,
                            e: "Foi no Pão de Açúcar, no Rio de Janeiro."
                        }
                    ],

                    medio: [
                        {
                            p: "Qual bairro de Nova Iguaçu apareceu logo no começo da história de vocês?",
                            a: [
                                "Cerâmica",
                                "Centro",
                                "Posse",
                                "Cabucu"
                            ],
                            c: 0,
                            e: "Cerâmica foi o bairro mencionado quando ela perguntou se você morava lá."
                        }
                    ],

                    dificil: [
                        {
                            p: "Qual foi a situação que originou a piada 'A BATHATA'?",
                            a: [
                                "Uma batata caiu na roupa dela",
                                "Uma batata caiu no chão",
                                "Vocês queimaram uma batata",
                                "Ela perdeu uma batata"
                            ],
                            c: 0,
                            e: "Uma batata caiu na roupa dela e vocês transformaram a situação na piada 'A BATHATA'."
                        }
                    ]
                }
            },

            {
                id: "especificas",
                nome: "ESPECÍFICAS DEMAIS",
                icone: "💀",

                questoes: {

                    facil: [
                        {
                            p: "Qual é a famosa piada interna envolvendo uma batata?",
                            a: [
                                "A BATHATA",
                                "A BATATA",
                                "O BATATÃO",
                                "BATATA SUPREMA"
                            ],
                            c: 0,
                            e: "A piada interna de vocês é 'A BATHATA'."
                        }
                    ],

                    medio: [
                        {
                            p: "Uma pessoa normal comeria quantos pratos daquele?",
                            a: [
                                "2 pratos",
                                "4 pratos",
                                "7 pratos",
                                "10 pratos"
                            ],
                            c: 2,
                            e: "Segundo a história de vocês, a resposta é 7 pratos."
                        }
                    ],

                    dificil: [
                        {
                            p: "Qual dessas combinações representa corretamente algumas coisas que a BEA gosta?",
                            a: [
                                "Fleetwood Mac, The Sims e Dreamcatcher",
                                "Queen, Minecraft e BTS",
                                "ABBA, Roblox e TWICE",
                                "Metallica, Fortnite e BLACKPINK"
                            ],
                            c: 0,
                            e: "Fleetwood Mac, The Sims e Dreamcatcher estão entre os gostos que você contou sobre a BEA."
                        }
                    ]
                }
            }
        ]
    }

};

  
                            
                        

 


/* =========================================================
   3. ESTADO
   ========================================================= */

let jogador = "";

let materiaAtual = null;        /* "matematica" | "fisica" */
let nivelAtual = null;          /* id do nível */
let dificuldadeAtual = "facil";

let questoes = [];
let indiceQuestao = 0;

let pontuacao = 0;
let acertos = 0;
let erros = 0;
let tempoTotal = 0;

let tempoRestante = 0;
let intervaloTimer = null;
let timeoutFeedback = null;

let respondeu = false;

let musicaFundo = null;
let musicaQuiz = null;
let musicaLiberada = false;    /* true depois da primeira interação do usuário */

let configuracoes = {
    som: true,
    musica: true,
    embaralhar: true
};


/* =========================================================
   4. ELEMENTOS
   ========================================================= */

const $ = (id) => document.getElementById(id);

const screens = document.querySelectorAll(".screen");

const gameHud = $("game-hud");

const usernameInput = $("username");

const subjectGrid = $("subject-grid");
const levelGrid = $("level-grid");
const levelsTitle = $("levels-title");
const levelsSubtitle = $("levels-subtitle");
const difficultySelect = $("difficulty-select");

const questionCategory = $("question-category");
const questionText = $("question-text");
const answersContainer = $("answers-container");

const answerFeedback = $("answer-feedback");
const feedbackIcon = $("feedback-icon");
const feedbackTitle = $("feedback-title");
const feedbackSelected = $("feedback-selected");
const feedbackCorrect = $("feedback-correct");
const feedbackExplanation = $("feedback-explanation");

const timerElement = $("timer");
const phaseDisplay = $("phase-display");
const categoryDisplay = $("category-display");
const difficultyDisplay = $("difficulty-display");
const questionProgress = $("question-progress");
const scoreDisplay = $("score-display");

const finalScore = $("final-score");
const finalCorrect = $("final-correct");
const finalWrong = $("final-wrong");
const finalTime = $("final-time");
const subjectResults = $("subject-results");
const resultTitle = $("result-title");
const resultStars = $("result-stars");

const rankingList = $("ranking-list");
const welcomePlayer = $("welcome-player");

const soundToggle = $("sound-toggle");
const musicToggle = $("music-toggle");
const shuffleToggle = $("shuffle-toggle");

const toast = $("toast");
const screenTransition = $("screen-transition");


/* =========================================================
   5. INICIALIZAÇÃO
   ========================================================= */

document.addEventListener("DOMContentLoaded", iniciarJogo);

function iniciarJogo() {

    carregarDados();

    configurarEventos();

    prepararMusicaFundo();

    renderizarMaterias();

    atualizarRanking();

    mostrarTela("home-screen");

}


/* =========================================================
   6. EVENTOS
   ========================================================= */

function configurarEventos() {

    on("start-game", () => {

        tocarSom("click");

        if (jogador) {
            abrirMaterias();
        } else {
            mostrarTela("username-screen");
        }

    });


    on("confirm-username", confirmarNome);


    if (usernameInput) {

        usernameInput.addEventListener("keydown", (evento) => {

            if (evento.key === "Enter") {
                confirmarNome();
            }

        });

    }


    /* menus da home */

    ["open-ranking", "open-ranking-mobile"].forEach((id) => {

        on(id, () => {
            atualizarRanking();
            mostrarTela("ranking-screen");
        });

    });


    ["open-how-to-play", "open-how-to-play-mobile"].forEach((id) => {

        on(id, () => mostrarTela("how-to-play-screen"));

    });


    ["open-settings", "open-settings-mobile"].forEach((id) => {

        on(id, () => {
            atualizarConfiguracoesUI();
            mostrarTela("settings-screen");
        });

    });


    /* botões voltar */

    document.querySelectorAll(".back-button").forEach((botao) => {

        botao.addEventListener("click", () => {

            tocarSom("click");

            mostrarTela(botao.dataset.target || "home-screen");

        });

    });


    on("back-to-subjects", abrirMaterias);

    on("return-map", () => abrirNiveis(materiaAtual));

    on("retry-level", () => iniciarNivel(materiaAtual, nivelAtual));

    on("continue-game", irParaProximoNivel);

    on("next-question", () => {
        tocarSom("click");
        proximaQuestao();
    });


    on("quit-quiz", () => {

        pararTimer();
        limparFeedback();
        abrirNiveis(materiaAtual);

    });


    /* dificuldade */

    if (difficultySelect) {

        difficultySelect.querySelectorAll(".difficulty-button").forEach((botao) => {

            botao.addEventListener("click", () => {

                dificuldadeAtual = botao.dataset.difficulty;

                salvarConfiguracoes();

                atualizarBotoesDificuldade();

                renderizarNiveis();

                tocarSom("click");

            });

        });

    }


    /* configurações */

    if (soundToggle) {

        soundToggle.addEventListener("change", () => {
            configuracoes.som = soundToggle.checked;
            salvarConfiguracoes();
            tocarSom("click");
        });

    }


    if (musicToggle) {

        musicToggle.addEventListener("change", () => {
            configuracoes.musica = musicToggle.checked;
            salvarConfiguracoes();
            atualizarMusicaFundo();
        });

    }


    if (shuffleToggle) {

        shuffleToggle.addEventListener("change", () => {
            configuracoes.embaralhar = shuffleToggle.checked;
            salvarConfiguracoes();
        });

    }


    on("reset-progress", () => {

        if (!confirm("Apagar todo o progresso e o ranking deste dispositivo?")) {
            return;
        }

        localStorage.removeItem(STORAGE_KEYS.progress);
        localStorage.removeItem(STORAGE_KEYS.ranking);

        renderizarMaterias();
        atualizarRanking();

        mostrarToast("🧹 Progresso apagado!");

    });


    /* teclado A, B, C, D */

    document.addEventListener("keydown", (evento) => {

        const quizAtivo = $("quiz-screen")?.classList.contains("active");

        if (!quizAtivo || respondeu) {
            return;
        }

        const tecla = evento.key.toUpperCase();

        if (["A", "B", "C", "D"].includes(tecla)) {

            answersContainer
                ?.querySelector(`[data-answer="${tecla}"]`)
                ?.click();

        }

    });

}


function on(id, callback) {

    const elemento = $(id);

    if (elemento) {
        elemento.addEventListener("click", callback);
    }

}


/* =========================================================
   7. NAVEGAÇÃO
   ========================================================= */

function mostrarTela(id) {

    const tela = $(id);

    if (!tela) {
        console.warn("Tela não encontrada:", id);
        return;
    }


    if (id !== "quiz-screen") {
        pararTimer();
    }


    document.body.dataset.screen = id;


    atualizarMusicaFundo();


    if (gameHud) {
        gameHud.classList.toggle("hidden", id !== "quiz-screen");
    }


    const trocar = () => {

        screens.forEach((screen) => screen.classList.remove("active"));

        tela.classList.add("active");

    };


    if (screenTransition) {

        screenTransition.classList.add("active");

        setTimeout(trocar, 180);

        setTimeout(() => screenTransition.classList.remove("active"), 420);

    } else {

        trocar();

    }

}


/* =========================================================
   8. NOME DO JOGADOR
   ========================================================= */

function confirmarNome() {

    if (!usernameInput) return;

    const nome = usernameInput.value.trim();


    if (nome.length < 2) {

        mostrarToast("⚠️ Use pelo menos 2 caracteres.");

        usernameInput.focus();

        return;

    }


    jogador = nome.substring(0, 16);

    localStorage.setItem(STORAGE_KEYS.player, jogador);

    tocarSom("success");

    abrirMaterias();

}


/* =========================================================
   9. TELA DE MATÉRIAS
   ========================================================= */

function abrirMaterias() {

    renderizarMaterias();

    mostrarTela("subject-screen");

}


function renderizarMaterias() {

    if (welcomePlayer) {

        welcomePlayer.textContent = jogador
            ? `Olá, ${jogador.toUpperCase()}!`
            : "Escolha por onde começar";

    }


    if (!subjectGrid) return;

    subjectGrid.innerHTML = "";


    Object.keys(MATERIAS).forEach((chave) => {

        const materia = MATERIAS[chave];

        const total = materia.niveis.length * Object.keys(DIFICULDADES).length;

        const concluidos = contarConcluidos(chave);

        const porcentagem = Math.round((concluidos / total) * 100);


        const card = document.createElement("button");

        card.type = "button";
        card.className = "subject-card";

        card.innerHTML = `
            <span class="subject-icon">${materia.icone}</span>
            <span class="subject-name">${materia.nome}</span>
            <span class="subject-info">${materia.niveis.length} níveis</span>
            <span class="progress-bar"><span style="width:${porcentagem}%"></span></span>
            <span class="subject-progress">${porcentagem}% concluído</span>
        `;


        card.addEventListener("click", () => {

            tocarSom("click");

            abrirNiveis(chave);

        });


        subjectGrid.appendChild(card);

    });

}


/* =========================================================
   10. TELA DE NÍVEIS
   ========================================================= */

function abrirNiveis(chaveMateria) {

    materiaAtual = chaveMateria || materiaAtual || "matematica";

    atualizarBotoesDificuldade();

    renderizarNiveis();

    mostrarTela("levels-screen");

}


function atualizarBotoesDificuldade() {

    if (!difficultySelect) return;

    difficultySelect.querySelectorAll(".difficulty-button").forEach((botao) => {

        botao.classList.toggle(
            "active",
            botao.dataset.difficulty === dificuldadeAtual
        );

    });

}


function renderizarNiveis() {

    const materia = MATERIAS[materiaAtual];

    if (!materia || !levelGrid) return;


    if (levelsTitle) {
        levelsTitle.textContent = `${materia.icone} ${materia.nome}`;
    }

    if (levelsSubtitle) {

        levelsSubtitle.textContent =
            `Dificuldade ${DIFICULDADES[dificuldadeAtual].nome} — ` +
            `${DIFICULDADES[dificuldadeAtual].tempo}s por questão`;

    }


    const progresso = carregarProgresso();

    levelGrid.innerHTML = "";


    materia.niveis.forEach((nivel, indice) => {

        const chave = chaveProgresso(materiaAtual, nivel.id, dificuldadeAtual);

        const registro = progresso[chave];

        const anterior = indice === 0
            ? null
            : materia.niveis[indice - 1];

        const liberado = indice === 0 ||
            Boolean(progresso[chaveProgresso(materiaAtual, anterior.id, dificuldadeAtual)]);


        const card = document.createElement("button");

        card.type = "button";

        card.className = `level-card ${liberado ? "unlocked" : "locked"}`;

        card.disabled = !liberado;


        const estrelas = registro ? registro.estrelas : 0;

        const totalQuestoes = Math.min(
            QUESTOES_POR_RODADA,
            nivel.questoes[dificuldadeAtual].length
        );


        card.innerHTML = `
            <span class="level-index">${indice + 1}</span>
            <span class="level-icon">${nivel.icone}</span>
            <span class="level-name">${nivel.nome}</span>
            <span class="level-stars">${"★".repeat(estrelas)}${"☆".repeat(3 - estrelas)}</span>
            <span class="level-meta">${totalQuestoes} questões${registro ? ` • ${registro.melhor} pts` : ""}</span>
            ${liberado ? "" : '<span class="lock-icon">🔒</span>'}
        `;


        card.addEventListener("click", () => {

            if (!liberado) {

                tocarSom("error");

                mostrarToast("🔒 Conclua o nível anterior primeiro!");

                return;

            }

            iniciarNivel(materiaAtual, nivel.id);

        });


        levelGrid.appendChild(card);

    });

}


/* =========================================================
   11. INICIAR NÍVEL
   ========================================================= */

function sortearQuestoes(banco) {

    const lista = banco.slice();

    const sorteadas = configuracoes.embaralhar ? embaralhar(lista) : lista;

    return sorteadas.slice(0, Math.min(QUESTOES_POR_RODADA, sorteadas.length));

}


function iniciarNivel(chaveMateria, idNivel) {

    const materia = MATERIAS[chaveMateria];

    const nivel = materia?.niveis.find((item) => item.id === idNivel);

    if (!nivel) {
        console.error("Nível inexistente:", chaveMateria, idNivel);
        return;
    }


    materiaAtual = chaveMateria;
    nivelAtual = idNivel;


    questoes = sortearQuestoes(nivel.questoes[dificuldadeAtual]);


    indiceQuestao = 0;
    pontuacao = 0;
    acertos = 0;
    erros = 0;
    tempoTotal = 0;
    respondeu = false;


    tocarSom("click");

    mostrarTela("quiz-screen");

    setTimeout(carregarQuestao, 200);

}


/* =========================================================
   12. CARREGAR QUESTÃO
   ========================================================= */

function carregarQuestao() {

    pararTimer();

    limparFeedback();


    const questao = questoes[indiceQuestao];

    if (!questao) {
        finalizarNivel();
        return;
    }


    respondeu = false;


    const materia = MATERIAS[materiaAtual];

    const nivel = materia.niveis.find((item) => item.id === nivelAtual);


    if (phaseDisplay) phaseDisplay.textContent = nivel.nome;

    if (categoryDisplay) categoryDisplay.textContent = materia.nome;

    if (difficultyDisplay) {
        difficultyDisplay.textContent = DIFICULDADES[dificuldadeAtual].nome;
    }

    if (questionProgress) {
        questionProgress.textContent = `${indiceQuestao + 1}/${questoes.length}`;
    }

    if (scoreDisplay) scoreDisplay.textContent = pontuacao;

    if (questionCategory) questionCategory.textContent = nivel.nome;

    if (questionText) questionText.textContent = questao.p;


    criarRespostas(questao);

    iniciarTimer();

}


/* =========================================================
   13. RESPOSTAS
   ========================================================= */

function criarRespostas(questao) {

    if (!answersContainer) return;

    answersContainer.innerHTML = "";


    const letras = ["A", "B", "C", "D"];


    questao.a.forEach((texto, indice) => {

        const botao = document.createElement("button");

        botao.type = "button";
        botao.className = "answer-button";
        botao.dataset.answer = letras[indice];
        botao.dataset.index = indice;


        const letra = document.createElement("span");
        letra.className = "answer-letter";
        letra.textContent = letras[indice];


        const conteudo = document.createElement("span");
        conteudo.className = "answer-text";
        conteudo.textContent = texto;


        botao.appendChild(letra);
        botao.appendChild(conteudo);

        botao.addEventListener("click", () => responderQuestao(indice));

        answersContainer.appendChild(botao);

    });

}


function responderQuestao(indiceEscolhido) {

    if (respondeu) return;

    respondeu = true;

    pararTimer();


    const questao = questoes[indiceQuestao];

    const correta = indiceEscolhido === questao.c;


    answersContainer.querySelectorAll(".answer-button").forEach((botao) => {

        botao.disabled = true;

        const indice = Number(botao.dataset.index);

        if (indice === questao.c) {
            botao.classList.add("correct");
        }

        if (indice === indiceEscolhido && !correta) {
            botao.classList.add("wrong");
        }

    });


    if (correta) {

        acertos++;

        const base = 100 + (tempoRestante * 10);

        pontuacao += Math.round(base * DIFICULDADES[dificuldadeAtual].multiplicador);

        tocarSom("success");

    } else {

        erros++;

        tocarSom("error");

    }


    tempoTotal += DIFICULDADES[dificuldadeAtual].tempo - tempoRestante;

    atualizarHUD();

    mostrarFeedback(correta, indiceEscolhido, questao, false);


    timeoutFeedback = setTimeout(proximaQuestao, TEMPO_FEEDBACK);

}


function tempoEsgotado() {

    if (respondeu) return;

    respondeu = true;

    pararTimer();


    const questao = questoes[indiceQuestao];

    erros++;


    answersContainer.querySelectorAll(".answer-button").forEach((botao) => {

        botao.disabled = true;

        if (Number(botao.dataset.index) === questao.c) {
            botao.classList.add("correct");
        }

    });


    tempoTotal += DIFICULDADES[dificuldadeAtual].tempo;

    if (timerElement) timerElement.textContent = "0";

    tocarSom("error");

    mostrarFeedback(false, null, questao, true);


    timeoutFeedback = setTimeout(proximaQuestao, TEMPO_FEEDBACK);

}


/* =========================================================
   14. TIMER
   ========================================================= */

function iniciarTimer() {

    pararTimer();

    tempoRestante = DIFICULDADES[dificuldadeAtual].tempo;

    atualizarTimer();


    intervaloTimer = setInterval(() => {

        tempoRestante--;

        atualizarTimer();

        if (tempoRestante <= 0) {
            tempoEsgotado();
        }

    }, 1000);

}


function atualizarTimer() {

    if (!timerElement) return;

    timerElement.textContent = Math.max(tempoRestante, 0);

    timerElement.classList.remove("warning", "danger");

    if (tempoRestante <= 5 && tempoRestante > 2) {
        timerElement.classList.add("warning");
    }

    if (tempoRestante <= 2) {
        timerElement.classList.add("danger");
    }

}


function pararTimer() {

    if (intervaloTimer) {

        clearInterval(intervaloTimer);

        intervaloTimer = null;

    }

}


/* =========================================================
   15. FEEDBACK
   ========================================================= */

function mostrarFeedback(correta, indiceEscolhido, questao, expirou) {

    if (!answerFeedback) return;

    answerFeedback.classList.remove("hidden");

    const letras = ["A", "B", "C", "D"];


    if (feedbackIcon) {

        feedbackIcon.textContent = correta ? "✓" : "✕";

        feedbackIcon.classList.toggle("is-wrong", !correta);

    }


    if (feedbackTitle) {

        feedbackTitle.textContent = expirou
            ? "⏰ TEMPO ESGOTADO!"
            : correta
                ? "⭐ RESPOSTA CORRETA!"
                : "❌ RESPOSTA ERRADA!";

    }


    if (feedbackSelected) {

        feedbackSelected.textContent = expirou
            ? "Você não respondeu a tempo."
            : `Você respondeu: ${letras[indiceEscolhido]} — ${questao.a[indiceEscolhido]}`;

    }


    if (feedbackCorrect) {

        feedbackCorrect.textContent =
            `Resposta correta: ${letras[questao.c]} — ${questao.a[questao.c]}`;

    }


    if (feedbackExplanation) {
        feedbackExplanation.textContent = questao.e;
    }

}


function limparFeedback() {

    if (timeoutFeedback) {

        clearTimeout(timeoutFeedback);

        timeoutFeedback = null;

    }

    answerFeedback?.classList.add("hidden");

}


function proximaQuestao() {

    limparFeedback();

    indiceQuestao++;

    if (indiceQuestao >= questoes.length) {
        finalizarNivel();
        return;
    }

    carregarQuestao();

}


/* =========================================================
   16. FINAL DO NÍVEL
   ========================================================= */

function finalizarNivel() {

    pararTimer();

    limparFeedback();


    const aproveitamento = acertos / questoes.length;

    const concluiu = aproveitamento >= ACERTO_MINIMO;

    const estrelas = calcularEstrelas(aproveitamento);


    if (concluiu) {

        const progresso = carregarProgresso();

        const chave = chaveProgresso(materiaAtual, nivelAtual, dificuldadeAtual);

        const anterior = progresso[chave];


        progresso[chave] = {
            estrelas: Math.max(estrelas, anterior ? anterior.estrelas : 0),
            melhor: Math.max(pontuacao, anterior ? anterior.melhor : 0)
        };


        salvarProgresso(progresso);

    }


    salvarResultadoRanking();

    mostrarResultado(concluiu, estrelas, aproveitamento);

}

function beaDesbloqueada() {
    const totalMatematica =
        MATERIAS.matematica.niveis.length * Object.keys(DIFICULDADES).length;

    const totalFisica =
        MATERIAS.fisica.niveis.length * Object.keys(DIFICULDADES).length;

    const concluidoMatematica = contarConcluidos("matematica");
    const concluidoFisica = contarConcluidos("fisica");

    return (
        concluidoMatematica >= totalMatematica &&
        concluidoFisica >= totalFisica
    );
}


function calcularEstrelas(aproveitamento) {

    if (aproveitamento >= 1) return 3;

    if (aproveitamento >= 0.8) return 2;

    if (aproveitamento >= ACERTO_MINIMO) return 1;

    return 0;

}


function mostrarResultado(concluiu, estrelas, aproveitamento) {

    if (finalScore) finalScore.textContent = pontuacao;

    if (finalCorrect) finalCorrect.textContent = acertos;

    if (finalWrong) finalWrong.textContent = erros;

    if (finalTime) finalTime.textContent = `${tempoTotal}s`;


    if (resultTitle) {

        resultTitle.textContent = concluiu
            ? "NÍVEL CONCLUÍDO!"
            : "QUASE LÁ!";

    }


    if (resultStars) {

        resultStars.textContent =
            "★".repeat(estrelas) + "☆".repeat(3 - estrelas);

    }


    if (subjectResults) {

        const materia = MATERIAS[materiaAtual];

        const nivel = materia.niveis.find((item) => item.id === nivelAtual);


        subjectResults.innerHTML = `
            <div class="subject-result">
                <span>${materia.nome} — ${nivel.nome}</span>
                <span><strong>${Math.round(aproveitamento * 100)}%</strong> de acerto</span>
            </div>
            <div class="subject-result">
                <span>Dificuldade</span>
                <span><strong>${DIFICULDADES[dificuldadeAtual].nome}</strong></span>
            </div>
            <div class="subject-result">
                <span>${concluiu ? "Próximo nível" : "Meta para concluir"}</span>
                <span><strong>${concluiu ? "liberado" : "60% de acerto"}</strong></span>
            </div>
        `;

    }


    const botaoContinuar = $("continue-game");

    if (botaoContinuar) {

        const proximo = obterProximoNivel();

        botaoContinuar.textContent = proximo
            ? "PRÓXIMO NÍVEL"
            : "VER NÍVEIS";

        botaoContinuar.disabled = Boolean(proximo) && !concluiu;

    }


    tocarSom(concluiu ? "success" : "error");

    mostrarTela("result-screen");

}


function obterProximoNivel() {

    const niveis = MATERIAS[materiaAtual].niveis;

    const indice = niveis.findIndex((item) => item.id === nivelAtual);

    return niveis[indice + 1] || null;

}


function irParaProximoNivel() {

    const proximo = obterProximoNivel();

    if (proximo) {
        iniciarNivel(materiaAtual, proximo.id);
    } else {
        abrirNiveis(materiaAtual);
    }

}


/* =========================================================
   17. HUD
   ========================================================= */

function atualizarHUD() {

    if (scoreDisplay) {

        scoreDisplay.textContent = pontuacao;

        const caixa = scoreDisplay.closest(".score");

        if (caixa) {

            caixa.classList.remove("score-pop");

            void caixa.offsetWidth;

            caixa.classList.add("score-pop");

        }

    }

}


/* =========================================================
   18. PROGRESSO
   ========================================================= */

function chaveProgresso(materia, nivel, dificuldade) {

    return `${materia}:${nivel}:${dificuldade}`;

}


function carregarProgresso() {

    try {

        const salvo = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.progress) || "{}"
        );

        return (salvo && typeof salvo === "object") ? salvo : {};

    } catch {

        return {};

    }

}


function salvarProgresso(progresso) {

    localStorage.setItem(
        STORAGE_KEYS.progress,
        JSON.stringify(progresso)
    );

}


function contarConcluidos(chaveMateria) {

    const progresso = carregarProgresso();

    return Object.keys(progresso).filter(
        (chave) => chave.startsWith(`${chaveMateria}:`)
    ).length;

}


/* =========================================================
   19. RANKING
   ========================================================= */

function carregarRanking() {

    try {

        const ranking = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.ranking) || "[]"
        );

        return Array.isArray(ranking) ? ranking : [];

    } catch {

        return [];

    }

}


function salvarResultadoRanking() {

    if (!jogador) return;


    const materia = MATERIAS[materiaAtual];

    const nivel = materia.niveis.find((item) => item.id === nivelAtual);


    const ranking = carregarRanking();


    ranking.push({
        nome: jogador,
        pontos: pontuacao,
        materia: materia.nome,
        nivel: nivel.nome,
        dificuldade: DIFICULDADES[dificuldadeAtual].nome,
        data: new Date().toISOString()
    });


    ranking.sort((a, b) => b.pontos - a.pontos);

    localStorage.setItem(
        STORAGE_KEYS.ranking,
        JSON.stringify(ranking.slice(0, 10))
    );


    atualizarRanking();

}


function atualizarRanking() {

    if (!rankingList) return;

    const ranking = carregarRanking();

    rankingList.innerHTML = "";


    if (ranking.length === 0) {

        rankingList.innerHTML =
            '<p class="ranking-empty">Ainda não existem partidas registradas.</p>';

        return;

    }


    ranking.forEach((registro, indice) => {

        const linha = document.createElement("div");

        linha.className = "ranking-entry";

        linha.innerHTML = `
            <span class="ranking-position">#${indice + 1}</span>
            <span class="ranking-name">
                ${registro.nome}
                <small>${registro.materia || ""} • ${registro.dificuldade || ""}</small>
            </span>
            <span class="ranking-score">${registro.pontos} pts</span>
        `;

        rankingList.appendChild(linha);

    });

}


/* =========================================================
   20. CONFIGURAÇÕES
   ========================================================= */

function carregarDados() {

    const nomeSalvo = localStorage.getItem(STORAGE_KEYS.player);

    if (nomeSalvo) {

        jogador = nomeSalvo;

        if (usernameInput) {
            usernameInput.value = jogador;
        }

    }


    try {

        const salvas = JSON.parse(
            localStorage.getItem(STORAGE_KEYS.settings) || "null"
        );

        if (salvas) {

            configuracoes = Object.assign(configuracoes, salvas);

            if (DIFICULDADES[salvas.dificuldade]) {
                dificuldadeAtual = salvas.dificuldade;
            }

        }

    } catch {

        /* mantém os padrões */

    }


    atualizarConfiguracoesUI();

    atualizarBotoesDificuldade();

}


function salvarConfiguracoes() {

    localStorage.setItem(
        STORAGE_KEYS.settings,
        JSON.stringify(
            Object.assign({}, configuracoes, { dificuldade: dificuldadeAtual })
        )
    );

}


function atualizarConfiguracoesUI() {

    if (soundToggle) soundToggle.checked = configuracoes.som;

    if (musicToggle) musicToggle.checked = configuracoes.musica;

    if (shuffleToggle) shuffleToggle.checked = configuracoes.embaralhar;

}


/* =========================================================
   21. UTILITÁRIOS
   ========================================================= */

function embaralhar(lista) {

    const copia = lista.slice();

    for (let i = copia.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [copia[i], copia[j]] = [copia[j], copia[i]];

    }

    return copia;

}


let toastTimeout = null;

function mostrarToast(mensagem) {

    if (!toast) return;

    toast.textContent = mensagem;

    toast.classList.remove("hidden");


    if (toastTimeout) clearTimeout(toastTimeout);

    toastTimeout = setTimeout(() => toast.classList.add("hidden"), 2500);

}


function tocarSom(tipo) {

    if (!configuracoes.som) return;


    try {

        const Contexto = window.AudioContext || window.webkitAudioContext;

        if (!Contexto) return;

        const audio = new Contexto();

        const oscilador = audio.createOscillator();

        const ganho = audio.createGain();


        oscilador.connect(ganho);

        ganho.connect(audio.destination);


        const frequencias = {
            success: 660,
            error: 180,
            click: 400
        };


        oscilador.frequency.value = frequencias[tipo] || 440;

        oscilador.type = "square";


        ganho.gain.setValueAtTime(0.04, audio.currentTime);

        ganho.gain.exponentialRampToValueAtTime(0.001, audio.currentTime + 0.12);


        oscilador.start();

        oscilador.stop(audio.currentTime + 0.12);

    } catch (erro) {

        console.warn("Não foi possível reproduzir som.", erro);

    }

}


/* =========================================================
   21.1 MÚSICA DE FUNDO
   ========================================================= */

function prepararMusicaFundo() {

    try {

        musicaFundo = new Audio(MUSICA_URL);

        musicaFundo.loop = true;
        musicaFundo.volume = MUSICA_VOLUME;
        musicaFundo.preload = "auto";


        musicaQuiz = new Audio(MUSICA_QUIZ_URL);

        musicaQuiz.loop = true;
        musicaQuiz.volume = MUSICA_VOLUME;
        musicaQuiz.preload = "auto";

    } catch (erro) {

        console.warn("Não foi possível carregar a música de fundo.", erro);

        musicaFundo = null;
        musicaQuiz = null;

    }


    /* navegadores só deixam tocar áudio após uma interação do usuário */

    const liberar = () => {

        musicaLiberada = true;

        atualizarMusicaFundo();

    };

    document.addEventListener("click", liberar, { once: true });
    document.addEventListener("keydown", liberar, { once: true });
    document.addEventListener("touchstart", liberar, { once: true });

}


function atualizarMusicaFundo() {

    if (!musicaFundo || !musicaQuiz) return;


    if (!configuracoes.musica || !musicaLiberada) {

        musicaFundo.pause();
        musicaQuiz.pause();

        return;

    }


    const emQuiz = document.body.dataset.screen === "quiz-screen";

    if (emQuiz) {

        musicaFundo.pause();
        musicaQuiz.play().catch(() => { /* aguarda próxima interação */ });

    } else {

        musicaQuiz.pause();
        musicaFundo.play().catch(() => { /* aguarda próxima interação */ });

    }

}


/* =========================================================
   22. API PÚBLICA (debug no console)
   ========================================================= */

window.PixelzinhoMaroto = {
    MATERIAS,
    DIFICULDADES,
    iniciarNivel,
    abrirMaterias,
    abrirNiveis,
    mostrarTela,
    carregarProgresso,
    carregarRanking
};