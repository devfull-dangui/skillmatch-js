// ============================================================================
// 1. CONFIGURAÇÃO DE DADOS (Config / Mocks)
// ============================================================================

const VAGAS_DISPONIVEIS = [
  {
    id: 1,
    titulo: "Desenvolvedor Front-end Júnior",
    requisitos: ["HTML", "CSS", "JavaScript", "Git", "React"],
  },
  {
    id: 2,
    titulo: "Desenvolvedor Back-end Pleno",
    requisitos: ["Node.js", "Express", "MongoDB", "SQL", "Git", "Docker"],
  },
  {
    id: 3,
    titulo: "Desenvolvedor Full-stack",
    requisitos: ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "Git"],
  },
];

const CANDIDATO_ATUAL = {
  nome: "Arthur",
  habilidades: ["HTML", "CSS", "JavaScript", "Git", "SQL"],
};

// ============================================================================
// 2. REGRAS DE NEGÓCIO (Funções Puras e Imutáveis)
// ============================================================================

/**
 * Compara o perfil do candidato com uma vaga específica.
 * @param {Object} candidato 
 * @param {Object} vaga 
 * @returns {Object} Resultado da compatibilidade
 */
const calcularCompatibilidadeVaga = (candidato, vaga) => {
  const habilidadesCandidato = new Set(
    candidato.habilidades.map((h) => h.toLowerCase())
  );
  
  const requisitosVaga = vaga.requisitos;

  // Filtra o que o candidato não tem (usando Set para busca O(1))
  const faltantes = requisitosVaga.filter(
    (req) => !habilidadesCandidato.has(req.toLowerCase())
  );

  const totalRequisitos = requisitosVaga.length;
  const totalCorrespondencias = totalRequisitos - faltantes.length;
  
  // Operador de coalescência nula (??) para evitar divisão por zero se a vaga não tiver requisitos
  const compatibilidade = totalRequisitos > 0 
    ? Math.round((totalCorrespondencias / totalRequisitos) * 100) 
    : 0;

  return {
    tituloVaga: vaga.titulo,
    compatibilidade,
    faltantes,
  };
};

/**
 * Analisa o candidato contra todas as vagas e retorna o relatório ordenado.
 */
const analisarAderenciaVagas = (candidato, listaVagas) => {
  return listaVagas
    .map((vaga) => calcularCompatibilidadeVaga(candidato, vaga))
    .toSorted((a, b) => b.compatibilidade - a.compatibilidade); // toSorted() não muta o array original (ES2023)
};

// ============================================================================
// 3. INTERFACE DE SAÍDA (Apenas Console/I/O)
// ============================================================================

const exibirRelatorioVagas = (relatorio) => {
  console.log("--- Compatibilidade por Vaga ---");
  
  for (const { tituloVaga, compatibilidade, faltantes } of relatorio) {
    console.log(`• ${tituloVaga}: ${compatibilidade}%`);
    
    const mensagemFaltantes = faltantes.length > 0
      ? `  Habilidades faltando: [${faltantes.join(", ")}]`
      : "  Você cumpre 100% dos requisitos! 🎉";
      
    console.log(mensagemFaltantes);
  }
};

const exibirRecomendacaoEstudo = (melhorOpcao) => {
  console.log("\n--- Recomendação de Estudo ---");
  
  if (melhorOpcao.faltantes.length === 0) {
    console.log("Parabéns! Você já tem todas as habilidades para a sua melhor vaga. Hora de enviar o currículo! 🚀");
    return;
  }

  console.log(`Para ficar 100% focado na sua melhor oportunidade (${melhorOpcao.tituloVaga}), foque em aprender:`);
  melhorOpcao.faltantes.forEach((hab) => console.log(`👉 Estudar: ${hab}`));
};

const executarSistemaRH = (candidato, vagas) => {
  console.log(`=== ANÁLISE DE PERFIL: ${candidato.nome.toUpperCase()} ===\n`);

  const relatorioOrdenado = analisarAderenciaVagas(candidato, vagas);
  const [melhorOpcao] = relatorioOrdenado; // Destructuring para pegar o primeiro elemento

  exibirRelatorioVagas(relatorioOrdenado);
  
  console.log("\n--- Melhor Opção ---");
  console.log(`Sua melhor vaga é: ${melhorOpcao.tituloVaga} com ${melhorOpcao.compatibilidade}% de compatibilidade.`);

  exibirRecomendacaoEstudo(melhorOpcao);
};

// ============================================================================
// 4. EXECUÇÃO
// ============================================================================
executarSistemaRH(CANDIDATO_ATUAL, VAGAS_DISPONIVEIS);