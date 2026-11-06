// =========================================================
// seed-data.js — Catálogo padrão de produtos (ferramentas de
// uso militar) e tabela de categorias usadas no projeto.
// =========================================================

// slug -> { label (nome exibido no site), emoji (imagem padrão) }
const CATEGORIAS = {
  ferramenta:    { label: 'Ferramentas',            emoji: '🛠️' },
  otica:         { label: 'Óptica e navegação',     emoji: '🔭' },
  iluminacao:    { label: 'Iluminação',             emoji: '🔦' },
  comunicacao:   { label: 'Comunicação',            emoji: '📻' },
  sobrevivencia: { label: 'Sobrevivência',          emoji: '🪓' },
  mochila:       { label: 'Mochilas e equipamento', emoji: '🎒' },
  cordame:       { label: 'Cordame',                emoji: '🪢' },
  socorros:      { label: 'Primeiros socorros',     emoji: '🩹' },
};

const PRODUTOS = [
  {
    nome: 'Alicate Multifunção Tático 16 em 1',
    categoria: 'ferramenta',
    preco: 189.9,
    estoque: 34,
    descricao:
      'Aço inoxidável com 16 funções: chave de fenda e afins, serra, lixa, abridor, furador e alicate. Vem com capa de transporte em Cordura para cinto ou colete MOLLE.',
    imagem: '🛠️',
  },
  {
    nome: 'Pá de Trincheira Dobrável Tactical',
    categoria: 'ferramenta',
    preco: 249.9,
    estoque: 18,
    descricao:
      'Pá militar dobrável em aço carbono, com ponta afiada e mini-serra embutida no dorso. Compacta, cabe no estojo de 30 cm e resiste a uso intenso em campo.',
    imagem: '⛏️',
  },
  {
    nome: 'Kit Chaves Táticas com 11 Pontas',
    categoria: 'ferramenta',
    preco: 89.9,
    estoque: 42,
    descricao:
      'Cabo magnético de precisão, 11 pontas compatíveis e case rígido militar. Feito para manutenção de rádios, ópticas e outros equipamentos em campanha.',
    imagem: '🔧',
  },
  {
    nome: 'Machado de Campo Bushcraft',
    categoria: 'sobrevivencia',
    preco: 299.9,
    estoque: 15,
    descricao:
      'Cabeça de aço forjado com gume e ponta de bater, cabo antiderrapante de 28 cm e bainha em nylon balístico. Para abrigo, lenha e rotina de campo.',
    imagem: '🪓',
  },
  {
    nome: 'Canivete Militar com Trava',
    categoria: 'sobrevivencia',
    preco: 129.9,
    estoque: 50,
    descricao:
      'Lâmina serrilhada de 100 mm com abertura assistida, trava de segurança e clip de cinto. Cabo em G10 texturizado, firme em uma ou duas mãos.',
    imagem: '🔪',
  },
  {
    nome: 'Serra de Sobrevivência em Arame',
    categoria: 'sobrevivencia',
    preco: 24.9,
    estoque: 80,
    descricao:
      'Serra em arame de aço com anéis para as mãos, corta madeira, plástico e osso. Pesa menos de 20 g e cabe em qualquer kit mínimo de sobrevivência.',
    imagem: '🪚',
  },
  {
    nome: 'Bússola Militar Lensática',
    categoria: 'otica',
    preco: 159.9,
    estoque: 27,
    descricao:
      'Bússola profissional com visor lensático, linha de mira, escala Beaufort e régua de mapas. À prova de água e choque, inclui cordão de pescoço.',
    imagem: '🧭',
  },
  {
    nome: 'Binóculo Militar 8x40 à Prova de Água',
    categoria: 'otica',
    preco: 459.9,
    estoque: 12,
    descricao:
      'Prismas BK-7 com lentes multi-coated, aumento de 8x com objetiva de 40 mm e foco central. Vem com case rígido, correia e capa impermeável.',
    imagem: '🔭',
  },
  {
    nome: 'Luneta Tática 4x32 com Trilho Picatinny',
    categoria: 'otica',
    preco: 549.9,
    estoque: 8,
    descricao:
      'Aumento 4x, objetiva 32 mm e retículo mil-dot iluminado. Montagem de fixação rápida em trilho, resistente a água, choque e névoa.',
    imagem: '🎯',
  },
  {
    nome: 'Kit de Navegação Completo',
    categoria: 'otica',
    preco: 199.9,
    estoque: 19,
    descricao:
      'Bússola de base, transferidor de coordenadas para escala 1:25.000 e case impermeável. Kit clássico de navegação terrestre em campo.',
    imagem: '🗺️',
  },
  {
    nome: 'Óculos Táticos Balísticos 3.0',
    categoria: 'otica',
    preco: 179.9,
    estoque: 24,
    descricao:
      'Lentes de policarbonato anti-risco e antiembaçante, com ventilação superior e tiras elásticas. Certificação de impacto balístico militar.',
    imagem: '🕶️',
  },
  {
    nome: 'Lanterna Tática LED 1000 Lúmens',
    categoria: 'iluminacao',
    preco: 119.9,
    estoque: 60,
    descricao:
      'Corpo em alumínio reforçado, LED de 1000 lúmens com 5 modos, incluindo estroboscópico e sinal de socorro. Recargável por USB-C e antiqueda.',
    imagem: '🔦',
  },
  {
    nome: 'Farol de Cabeça Tático com Sensor',
    categoria: 'iluminacao',
    preco: 89.9,
    estoque: 45,
    descricao:
      'Farol LED de 800 lúmens com acendimento por sensor de movimento, feixe de até 120 m e modo vermelho de preservação de visão noturna.',
    imagem: '💡',
  },
  {
    nome: 'Painel Solar Portátil 20 W Militar',
    categoria: 'iluminacao',
    preco: 439.9,
    estoque: 10,
    descricao:
      'Painel solar dobrável de 20 W com duas saídas USB e tecido 600D impermeável. Mantém rádios e lanternas carregadas em missão prolongada.',
    imagem: '🔋',
  },
  {
    nome: 'Bastão de Sinalização Química (6 un)',
    categoria: 'iluminacao',
    preco: 34.9,
    estoque: 66,
    descricao:
      'Kit com 6 bastões químicos de luz verde com duração de 8 horas. À prova de água, não inflamável, para sinalização e marcação de segurança.',
    imagem: '🟢',
  },
  {
    nome: 'Par de Rádio Comunicador Militar 8 km',
    categoria: 'comunicacao',
    preco: 329.9,
    estoque: 22,
    descricao:
      'Par de rádios PMR de 22 canais com alcance até 8 km em campo aberto, monitor de canal, lanterna integrada e fone embutido nos fones de ouvido.',
    imagem: '📻',
  },
  {
    nome: 'Antena Dobrável de Campo SMA-F',
    categoria: 'comunicacao',
    preco: 149.9,
    estoque: 17,
    descricao:
      'Antena dobrável de fibra de vidro com conector SMA-F e ganho de 2.15 dBi. Compatível com rádios de comunicação tática portáteis.',
    imagem: '📡',
  },
  {
    nome: 'Apito de Resgate Militar',
    categoria: 'comunicacao',
    preco: 24.9,
    estoque: 95,
    descricao:
      'Apito de alumínio de 120 dB, audível a mais de 1 km. Vem com cordão de paracord e clip de cinto. Usado para sinalização e resgate em campo.',
    imagem: '📯',
  },
  {
    nome: 'Mochila Militar 40 L Impermeável',
    categoria: 'mochila',
    preco: 379.9,
    estoque: 20,
    descricao:
      'Mochila de assalto de 40 L com sistema MOLLE, nylon 600D revestido e capa de chuva própria. Divisões com zíper impermeável e costuras reforçadas.',
    imagem: '🎒',
  },
  {
    nome: 'Mochila Compacta Assault 25 L',
    categoria: 'mochila',
    preco: 249.9,
    estoque: 28,
    descricao:
      'Compacta e leve, 25 L de capacidade, alças com espuma EVA e costuras reforçadas. Ideal para patrulha de 24 horas e missões de rápido deslocamento.',
    imagem: '🎒',
  },
  {
    nome: 'Paracord Militar 550 (30 m)',
    categoria: 'cordame',
    preco: 79.9,
    estoque: 72,
    descricao:
      'Corda de 7 miolos com 30 metros de extensão e resistência de 250 kg. Serve para abrigos, armadilhas, laços, amarração de carga e emergências.',
    imagem: '🪢',
  },
  {
    nome: 'Kit Cordame com Mosquetões',
    categoria: 'cordame',
    preco: 119.9,
    estoque: 30,
    descricao:
      'Inclui 15 m de corda tática, 4 mosquetões de alumínio e 2 tensores de fita. Monta abrigos e pontos de ancoragem de forma rápida e segura.',
    imagem: '🔗',
  },
  {
    nome: 'Kit Primeiros Socorros Militar IFAK',
    categoria: 'socorros',
    preco: 219.9,
    estoque: 25,
    descricao:
      'Bolso MOLLE com IFAK completo: bandagens compressivas, torniquete, gaze estéril, pinça, luvas e tesoura. Padrão de atendimento em combate.',
    imagem: '⛑️',
  },
  {
    nome: 'Torniquete Tático de Tração',
    categoria: 'socorros',
    preco: 99.9,
    estoque: 40,
    descricao:
      'Torniquete de catraca com haste reforçada e fita de 38 mm. Controle de hemorragia com uma mão e espaço para registrar a hora da aplicação.',
    imagem: '🩹',
  },
  {
    nome: 'Bandagem Compressiva Israelense (4 un)',
    categoria: 'socorros',
    preco: 79.9,
    estoque: 55,
    descricao:
      'Pacote com 4 bandagens compressivas estéreis de 15 cm, padrão militar de primeiros socorros para conter sangramentos e imobilizar ferimentos.',
    imagem: '🩹',
  },
  {
    nome: 'Isqueiro Tático à Prova de Vento',
    categoria: 'sobrevivencia',
    preco: 59.9,
    estoque: 38,
    descricao:
      'Isqueiro de campo com chama dupla resistente a vento, janela de combustível e vedação reforçada. Acompanha fósforos impermeáveis em estojo.',
    imagem: '🔥',
  },
  {
    nome: 'Filtro de Água de Campo',
    categoria: 'sobrevivencia',
    preco: 189.9,
    estoque: 33,
    descricao:
      'Filtro individual por sucção que remove 99.9% das bactérias e filtra até 1000 litros. Pesa 85 g e cabe no bolso do uniforme de campanha.',
    imagem: '💧',
  },
  {
    nome: 'Cantil Militar Inox 1 L',
    categoria: 'sobrevivencia',
    preco: 99.9,
    estoque: 37,
    descricao:
      'Cantil de aço inoxidável de 1 litro com capa em feltro, caneca embutida e alça de transporte. Ideal para marchas prolongadas e acampamentos.',
    imagem: '🍶',
  },
  {
    nome: 'Rede de Camuflagem 3 x 2 m',
    categoria: 'sobrevivencia',
    preco: 219.9,
    estoque: 14,
    descricao:
      'Rede militar de camuflagem de 3 x 2 m com olhais reforçados. Serve para cobrir posições, esconder equipamento e montar esconderijo tático.',
    imagem: '🌿',
  },
];

module.exports = { PRODUTOS, CATEGORIAS };
