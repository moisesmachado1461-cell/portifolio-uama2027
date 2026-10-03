function parseDateOnly(dateValue: string): { year: number; month: number; day: number } | null {
  const value = (dateValue || '').trim();
  const match = /^(\d{4})-(\d{2})-(\d{2})(?:T.*)?$/.exec(value);

  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
    return null;
  }

  if (month < 1 || month > 12 || day < 1 || day > 31) {
    return null;
  }

  return { year, month, day };
}

export function calculateAge(birthDate: string, referenceDate: Date = new Date()): number {
  const birth = parseDateOnly(birthDate);
  if (!birth) return 0;

  let age = referenceDate.getFullYear() - birth.year;

  const currentMonth = referenceDate.getMonth() + 1;
  const currentDay = referenceDate.getDate();

  const hasNotHadBirthday =
    currentMonth < birth.month ||
    (currentMonth === birth.month && currentDay < birth.day);

  if (hasNotHadBirthday) age--;

  return Math.max(0, age);
}

export function isBirthdayToday(birthDate: string, referenceDate: Date = new Date()): boolean {
  const birth = parseDateOnly(birthDate);
  if (!birth) return false;

  return (
    birth.month === referenceDate.getMonth() + 1 &&
    birth.day === referenceDate.getDate()
  );
}

const birthdayMessages: Record<number, string> = {
  1: "Feliz 1 ano! 🎂 Que Deus abençoe sua vida desde os primeiros passos e que você cresça cercada de amor, saúde e alegria.",
  2: "Feliz 2 anos! 💕 Que o Senhor cuide de cada momento da sua infância e encha sua vida de alegria e proteção.",
  3: "Feliz 3 anos! 🎈 Que Deus continue guiando seu crescimento e que nunca faltem amor, saúde e muitos sorrisos.",
  4: "Feliz 4 anos! 🌷 Que o Senhor abençoe cada novo aprendizado e faça sua vida florescer em alegria e amor.",
  5: "Feliz 5 anos! 🎂 Que Deus proteja seus passos e permita que você cresça sempre cercada de carinho, fé e alegria.",
  6: "Feliz 6 anos! ✨ Que o Senhor ilumine seu caminho, cuide do seu coração e conceda muitos momentos felizes.",
  7: "Feliz 7 anos! 💕 Que Deus abençoe sua infância, seus sonhos e cada descoberta desse novo ano de vida.",
  8: "Feliz 8 anos! 🎉 Que o Senhor esteja sempre perto de você, protegendo seus passos e enchendo seu coração de alegria.",
  9: "Feliz 9 anos! 🌷 Que Deus continue cuidando de você e que sua vida seja sempre marcada por amor, saúde e esperança.",
  10: "Feliz 10 anos! 🎂 Que Deus abençoe essa nova fase e faça crescer em seu coração a fé, a alegria e o amor.",
  11: "Feliz 11 anos! ✨ Que o Senhor guie suas escolhas, proteja seus sonhos e esteja presente em cada novo caminho.",
  12: "Feliz 12 anos! 💕 Que Deus fortaleça sua fé, cuide do seu coração e abençoe cada passo dessa nova fase.",
  13: "Feliz 13 anos! 🎉 Que o Senhor conduza sua adolescência com sabedoria, alegria, proteção e muita fé.",
  14: "Feliz 14 anos! 🌷 Que Deus ilumine seus caminhos, fortaleça seus sonhos e esteja presente em todas as suas decisões.",
  15: "Feliz 15 anos! 🎂 Que esse novo ciclo seja cheio da presença de Deus, de sonhos realizados e de momentos inesquecíveis.",
  16: "Feliz 16 anos! ✨ Que o Senhor dirija seus passos e conceda sabedoria para cada escolha que estiver diante de você.",
  17: "Feliz 17 anos! 💕 Que Deus prepare um caminho bonito para sua vida e fortaleça seu coração para tudo que virá.",
  18: "Feliz 18 anos! 🎉 Que essa nova etapa seja guiada por Deus, cheia de propósito, sabedoria, fé e boas oportunidades.",
  19: "Feliz 19 anos! 🌷 Que o Senhor abençoe seus sonhos e ensine seu coração a confiar nEle em cada nova etapa.",
  20: "Feliz 20 anos! 🎂 Que Deus conduza seus próximos passos e faça deste novo ciclo um tempo de crescimento, fé e realizações.",
  21: "Feliz 21 anos! ✨ Que o Senhor esteja à frente dos seus planos e abençoe cada decisão que você tomar.",
  22: "Feliz 22 anos! 💕 Que Deus renove suas forças, fortaleça sua fé e abra portas segundo a vontade dEle.",
  23: "Feliz 23 anos! 🎉 Que o Senhor ilumine seu caminho e transforme cada desafio em uma oportunidade de crescer na fé.",
  24: "Feliz 24 anos! 🌷 Que Deus abençoe profundamente sua vida e que você encontre alegria na presença dEle todos os dias.",
  25: "Feliz 25 anos! 🎂 Que este novo ciclo seja marcado pela graça de Deus, por novos sonhos e muitas bênçãos.",
  26: "Feliz 26 anos! ✨ Que o Senhor firme seus passos, guarde seu coração e conduza sua vida segundo Seus planos.",
  27: "Feliz 27 anos! 💕 Que Deus continue escrevendo uma linda história em sua vida, cheia de propósito, fé e esperança.",
  28: "Feliz 28 anos! 🎉 Que o Senhor abençoe seus projetos, sua família e cada sonho que estiver de acordo com a vontade dEle.",
  29: "Feliz 29 anos! 🌷 Que Deus lhe conceda sabedoria para viver este novo ciclo com fé, coragem, paz e gratidão.",
  30: "Feliz 30 anos! 🎂 Que Deus abençoe essa nova década e faça florescer em sua vida tudo aquilo que Ele preparou.",
  31: "Feliz 31 anos! ✨ Que o Senhor renove sua esperança e conduza cada novo passo com graça, sabedoria e paz.",
  32: "Feliz 32 anos! 💕 Que Deus fortaleça sua caminhada e permita que você reconheça Suas bênçãos em cada detalhe.",
  33: "Feliz 33 anos! 🎉 Que o Senhor abençoe seu novo ciclo e use sua vida para levar amor, esperança e fé a outras pessoas.",
  34: "Feliz 34 anos! 🌷 Que Deus continue sustentando sua caminhada e conceda força para viver cada novo propósito.",
  35: "Feliz 35 anos! 🎂 Que o Senhor abençoe sua casa, sua família, seus sonhos e todos os caminhos que estiver trilhando.",
  36: "Feliz 36 anos! ✨ Que Deus renove suas forças a cada manhã e faça deste novo ano um tempo de paz e crescimento.",
  37: "Feliz 37 anos! 💕 Que o Senhor continue sendo sua direção e que Sua presença traga paz para cada novo desafio.",
  38: "Feliz 38 anos! 🎉 Que Deus abençoe sua história e permita que você continue sendo instrumento de amor e bênção.",
  39: "Feliz 39 anos! 🌷 Que o Senhor fortaleça sua fé e prepare um novo ciclo cheio de graça, saúde e esperança.",
  40: "Feliz 40 anos! 🎂 Que Deus abençoe esta nova fase e que você continue vivendo cada dia com fé, propósito e gratidão.",
  41: "Feliz 41 anos! ✨ Que o Senhor renove seus sonhos e fortaleça seu coração para tudo aquilo que ainda está por viver.",
  42: "Feliz 42 anos! 💕 Que Deus esteja presente em cada decisão e conceda paz para aproveitar as bênçãos deste novo ciclo.",
  43: "Feliz 43 anos! 🎉 Que o Senhor continue guiando sua história e transformando sua caminhada em um testemunho de fé.",
  44: "Feliz 44 anos! 🌷 Que Deus abençoe sua família, seus projetos e cada novo passo que você der.",
  45: "Feliz 45 anos! 🎂 Que a graça de Deus continue sustentando sua vida e que nunca faltem motivos para agradecer.",
  46: "Feliz 46 anos! ✨ Que o Senhor fortaleça sua caminhada, renove suas forças e encha seus dias de paz.",
  47: "Feliz 47 anos! 💕 Que Deus continue cuidando de você e mostrando que Seus planos são maiores e melhores.",
  48: "Feliz 48 anos! 🎉 Que o Senhor abençoe este novo ciclo com saúde, sabedoria, alegria e muita presença de Deus.",
  49: "Feliz 49 anos! 🌷 Que Deus renove sua esperança e permita que você veja Suas mãos trabalhando em cada área da sua vida.",
  50: "Feliz 50 anos! 🎂 Que Deus abençoe este marco tão especial e que os próximos anos sejam ainda mais cheios de graça e propósito.",
  51: "Feliz 51 anos! ✨ Que o Senhor continue conduzindo sua história e acrescentando dias de paz, saúde e alegria.",
  52: "Feliz 52 anos! 💕 Que Deus fortaleça sua fé e abençoe cada novo capítulo da história que Ele está escrevendo.",
  53: "Feliz 53 anos! 🎉 Que o Senhor renove suas forças e faça transbordar em sua vida a paz que vem dEle.",
  54: "Feliz 54 anos! 🌷 Que Deus abençoe sua caminhada e permita que cada experiência se transforme em sabedoria e testemunho.",
  55: "Feliz 55 anos! 🎂 Que o Senhor continue sendo sua força, sua direção e sua esperança em todos os dias.",
  56: "Feliz 56 anos! ✨ Que Deus derrame novas bênçãos sobre sua vida e lhe conceda muitos motivos para sorrir e agradecer.",
  57: "Feliz 57 anos! 💕 Que o Senhor guarde seu coração, fortaleça sua fé e abençoe profundamente sua família.",
  58: "Feliz 58 anos! 🎉 Que Deus continue sustentando seus passos e renovando sua esperança a cada novo amanhecer.",
  59: "Feliz 59 anos! 🌷 Que o Senhor abençoe este novo ciclo e permita que sua vida continue sendo uma bênção para muitos.",
  60: "Feliz 60 anos! 🎂 Que Deus celebre com você esta linda história e conceda muitos anos de saúde, paz e Sua presença.",
  61: "Feliz 61 anos! ✨ Que o Senhor continue guiando seus passos e recompense sua caminhada com paz, saúde e alegria.",
  62: "Feliz 62 anos! 💕 Que Deus renove suas forças e encha seus dias com a alegria de viver cada momento ao lado dEle.",
  63: "Feliz 63 anos! 🎉 Que o Senhor abençoe sua vida abundantemente e faça de sua história um testemunho de Sua fidelidade.",
  64: "Feliz 64 anos! 🌷 Que Deus continue cuidando de você e conceda sabedoria, saúde e muitos momentos felizes.",
  65: "Feliz 65 anos! 🎂 Que o Senhor abençoe este novo ciclo e permita que você continue vivendo com fé, gratidão e propósito.",
  66: "Feliz 66 anos! ✨ Que Deus renove sua alegria e faça sua vida continuar sendo uma fonte de amor e bênção.",
  67: "Feliz 67 anos! 💕 Que o Senhor sustente sua caminhada e encha seu coração de paz em cada novo dia.",
  68: "Feliz 68 anos! 🎉 Que Deus abençoe sua família, conserve sua saúde e continue guiando sua vida com Sua graça.",
  69: "Feliz 69 anos! 🌷 Que o Senhor continue escrevendo capítulos lindos em sua história e fortalecendo sua fé.",
  70: "Feliz 70 anos! 🎂 Que Deus abençoe esta linda caminhada e conceda muitos anos de vida, saúde, paz e alegria.",
  71: "Feliz 71 anos! ✨ Que o Senhor continue sendo sua força e que cada novo amanhecer traga motivos para agradecer.",
  72: "Feliz 72 anos! 💕 Que Deus guarde sua vida, abençoe sua família e renove diariamente sua esperança.",
  73: "Feliz 73 anos! 🎉 Que o Senhor continue mostrando Sua fidelidade e enchendo seus dias de paz e alegria.",
  74: "Feliz 74 anos! 🌷 Que Deus abençoe cada lembrança, cada conquista e cada novo dia que Ele lhe conceder.",
  75: "Feliz 75 anos! 🎂 Que o Senhor continue sustentando sua vida e fazendo de sua história um lindo testemunho de fé.",
  76: "Feliz 76 anos! ✨ Que Deus renove suas forças, cuide de sua saúde e encha seu coração de gratidão.",
  77: "Feliz 77 anos! 💕 Que o Senhor continue sendo seu refúgio e sua força, abençoando cada novo dia.",
  78: "Feliz 78 anos! 🎉 Que Deus cubra sua vida com Sua graça e permita muitos momentos de alegria junto àqueles que você ama.",
  79: "Feliz 79 anos! 🌷 Que o Senhor continue guiando seus passos e demonstrando Sua bondade em cada amanhecer.",
  80: "Feliz 80 anos! 🎂 Que Deus abençoe esta história tão especial e conceda muitos dias de saúde, paz e alegria.",
  81: "Feliz 81 anos! ✨ Que o Senhor continue sendo sua companhia, sua força e sua esperança em todos os momentos.",
  82: "Feliz 82 anos! 💕 Que Deus conserve sua saúde, fortaleça seu coração e encha sua vida de amor e paz.",
  83: "Feliz 83 anos! 🎉 Que o Senhor continue abençoando sua caminhada e permitindo que sua vida inspire muitas pessoas.",
  84: "Feliz 84 anos! 🌷 Que Deus esteja presente em cada dia e que Sua paz permaneça sempre em seu coração.",
  85: "Feliz 85 anos! 🎂 Que o Senhor recompense sua caminhada com muitos momentos de alegria, carinho e gratidão.",
  86: "Feliz 86 anos! ✨ Que Deus continue sustentando sua vida e cercando você de amor, cuidado e paz.",
  87: "Feliz 87 anos! 💕 Que o Senhor abençoe sua família e permita que você continue desfrutando das bênçãos de cada novo dia.",
  88: "Feliz 88 anos! 🎉 Que Deus continue escrevendo uma história de graça e fidelidade em sua vida.",
  89: "Feliz 89 anos! 🌷 Que o Senhor fortaleça seu coração e encha seus dias de paz, carinho e gratidão.",
  90: "Feliz 90 anos! 🎂 Que Deus abençoe profundamente esta história tão bonita e conceda muitos momentos cercados de amor.",
  91: "Feliz 91 anos! ✨ Que o Senhor continue sendo sua força e que Sua presença traga paz e alegria ao seu coração.",
  92: "Feliz 92 anos! 💕 Que Deus continue guardando sua vida e permitindo que cada dia seja recebido com gratidão.",
  93: "Feliz 93 anos! 🎉 Que o Senhor abençoe sua caminhada e faça sua história continuar sendo testemunho de Sua fidelidade.",
  94: "Feliz 94 anos! 🌷 Que Deus renove sua alegria, conserve sua saúde e esteja presente em cada novo dia.",
  95: "Feliz 95 anos! 🎂 Que o Senhor abençoe sua vida e permita que você continue cercada pelo amor da família e pela graça de Deus.",
  96: "Feliz 96 anos! ✨ Que Deus continue cuidando de cada detalhe da sua vida e enchendo seu coração de paz.",
  97: "Feliz 97 anos! 💕 Que o Senhor continue sustentando sua caminhada e derramando Sua graça sobre sua vida.",
  98: "Feliz 98 anos! 🎉 Que Deus abençoe cada novo amanhecer e permita muitos momentos de amor, paz e gratidão.",
  99: "Feliz 99 anos! 🌷 Que o Senhor continue guardando sua vida e que sua história permaneça como testemunho de fé e perseverança.",
  100: "Feliz 100 anos! 🎂✨ Que Deus abençoe esta história extraordinária e conceda a você muita paz, alegria e o carinho de todos que a amam.",
};

export function generateBirthdayMessage(
  name: string,
  age: number
): string {
  const firstName = name.trim().split(' ')[0];
  const message = birthdayMessages[age];

  if (!message) {
    return `Feliz aniversário, ${firstName}! Que este novo ciclo seja cheio de saúde, paz, carinho e muitos momentos felizes.`;
  }

  return message.replace(/^Feliz \d+ anos!/, `Feliz ${age} anos, ${firstName}!`);
}
