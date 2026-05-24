// ==========================================
// 1. CLASSES, CONSTRUTOR, THIS E HERANÇA
// ==========================================

// Classe Base (Mãe)
class Vaga {
  constructor(id, titulo, ativa = true) {
    this.id = id;
    this.titulo = titulo;
    this.ativa = ativa; // Uso de booleano
  }
}

// Classe Filha (Herança)
class VagaTecnologia extends Vaga {
  constructor(id, titulo, requisitos) {
    super(id, titulo); // Chama o construtor da classe pai
    this.requisitos = requisitos; // Uso do 'this'
  }
}

// Criando pelo menos 3 vagas fictícias usando a classe
const VAGAS_DISPONIVEIS = [
  new VagaTecnologia(1, "Desenvolvedor Front-end Júnior", ["HTML", "CSS", "JavaScript", "Git", "React"]),
  new VagaTecnologia(2, "Desenvolvedor Back-end Pleno", ["Node.js", "Express", "MongoDB", "SQL", "Git", "Docker"]),
  new VagaTecnologia(3, "Desenvolvedor Full-stack", ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git"])
];

// O objeto candidato original (Contém strings, números e array)
const CANDIDATO_ATUAL = {
  nome: "Arthur",
  idade: 25, // Número
  habilidades: ["HTML", "CSS", "JavaScript", "Git", "SQL", "React"]
};

// ==========================================
// 2. PROMISES E ASYNC/AWAIT
// ==========================================

// Simula uma busca assíncrona em uma API/Banco de dados usando Promise
const buscarDadosCandidatoDoServidor = (candidato) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(candidato);
    }, 1000); // Simula 1 segundo de espera
  });
};

// ==========================================
// 3. CLOSURE E CALLBACK
// ==========================================

// Exemplo de Closure: Mantém o histórico de análises em um escopo fechado
function criarGerenciadorHistorico() {
  const historico = []; // Array privado na closure

  return {
    adicionarAoHistorico(vagaNome, compatibilidade) {
      historico.push({ vagaNome, compatibilidade, data: new Date() });
    },
    exibirTotalConsultas() {
      return `Total de análises guardadas no histórico: ${historico.length}`;
    }
  };
}
const historicoDeBuscas = criarGerenciadorHistorico();

// Exemplo de Função que aceita um Callback explícito
const processarSaidaLog = (mensagem, callbackExibicao) => {
  callbackExibicao(mensagem);
};

// ==========================================
// 4. REGRAS DE NEGÓCIO E MÉTODOS DE ARRAY
// ==========================================

const calcularCompatibilidadeVaga = (candidato, vaga) => {
  const habilidadesCandidato = new Set(candidato.habilidades.map(h => h.toLowerCase()));
  const requisitosVaga = vaga.requisitos;

  // Método de Array 1: Filter
  const faltantes = requisitosVaga.filter(req => !habilidadesCandidato.has(req.toLowerCase()));

  const totalRequisitos = requisitosVaga.length;
  const totalCorrespondencias = totalRequisitos - faltantes.length;
  
  // Operador Ternário, Operadores Lógicos e Matemáticos
  const compatibilidade = totalRequisitos > 0 && vaga.ativa
    ? Math.round((totalCorrespondencias / totalRequisitos) * 100) 
    : 0;

  // Alimenta a nossa closure para histórico
  historicoDeBuscas.adicionarAoHistorico(vaga.titulo, compatibilidade);

  return {
    tituloVaga: vaga.titulo,
    compatibilidade,
    faltantes,
  };
};

// ==========================================
// 5. INTERFACE E ESTRUTURAS DE REPETIÇÃO
// ==========================================

const exibirRelatorioVagas = (relatorio) => {
  console.log("--- Compatibilidade por Vaga ---");
  
  // Método de Array 2: ForEach (também serve como estrutura de repetição)
  relatorio.forEach(({ tituloVaga, compatibilidade, faltantes }) => {
    console.log(`• ${tituloVaga}: ${compatibilidade}%`);
    
    // Switch-Case testando a compatibilidade
    switch (true) {
      case (compatibilidade === 100):
        console.log("  Parabéns! Você cumpre 100% dos requisitos! 🎉");
        break;
      case (compatibilidade >= 50):
        console.log(`  Boa compatibilidade! Faltam apenas: [${faltantes.join(", ")}]`);
        break;
      default:
        console.log(`  Baixa compatibilidade. Habilidades faltando: [${faltantes.join(", ")}]`);
    }
  });
};

const exibirRecomendacaoEstudo = (melhorOpcao) => {
  console.log("\n--- Recomendação de Estudo ---");
  
  if (melhorOpcao.faltantes.length === 0) {
    console.log("Parabéns! Hora de enviar o currículo! 🚀");
    return;
  }

  console.log(`Para a vaga de (${melhorOpcao.tituloVaga}), use nosso loop de estudos:`);
  
  // Estrutura de repetição clássica: While
  let i = 0;
  while (i < melhorOpcao.faltantes.length) {
    console.log(`Estudar: ${melhorOpcao.faltantes[i]}`);
    i++;
  }
};

// Função Principal configurada como ASYNC para permitir o AWAIT
const executarSistemaRH = async () => {
  console.log("Carregando dados do candidato assincronamente...\n");
  
  // Uso do Await para esperar a Promise resolver
  const candidato = await buscarDadosCandidatoDoServidor(CANDIDATO_ATUAL);

  // Impressão usando a arrow function que chama o callback
  processarSaidaLog(`=== ANÁLISE DE PERFIL: ${candidato.nome.toUpperCase()} ===\n`, console.log);

  // Método de Array 3: Map (com a ordenação do toSorted)
  const relatorioOrdenado = VAGAS_DISPONIVEIS
    .map((vaga) => calcularCompatibilidadeVaga(candidato, vaga))
    .toSorted((a, b) => b.compatibilidade - a.compatibilidade);

  const [melhorOpcao] = relatorioOrdenado;

  exibirRelatorioVagas(relatorioOrdenado);
  
  console.log("\n--- Melhor Opção ---");
  console.log(`Sua melhor vaga é: ${melhorOpcao.tituloVaga} com ${melhorOpcao.compatibilidade}% de compatibilidade.`);

  exibirRecomendacaoEstudo(melhorOpcao);

  // Testando o output da closure
  console.log(`\n[Sistema]: ${historicoDeBuscas.exibirTotalConsultas()}`);
};

// ==========================================
// EXECUÇÃO DO PROGRAMA
// ==========================================
executarSistemaRH();