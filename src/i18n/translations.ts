export type Language = 'pt-BR' | 'en' | 'es';

export interface AppTranslations {
  common: {
    save: string;
    cancel: string;
    edit: string;
    delete: string;
    close: string;
    download: string;
    add: string;
    all: string;
    date: string;
    notes: string;
    selectChild: string;
    noPreview: string;
    downloadFile: string;
    uploadFile: string;
    locale: string;
  };
  sidebar: {
    childrenSection: string;
    noChildren: string;
    childNamePlaceholder: string;
    addButton: string;
    cancelButton: string;
    savedLocally: string;
    languageLabel: string;
    nav: {
      profile: string;
      agenda: string;
      prescriptions: string;
      growth: string;
      food: string;
      vaccines: string;
      contacts: string;
    };
  };
  profile: {
    title: string;
    subtitle: string;
    save: string;
    cancel: string;
    delete: string;
    noChild: string;
    noChildSubtitle: string;
    nameLabel: string;
    namePlaceholder: string;
    birthDateLabel: string;
    registerButton: string;
    summary: string;
    nameField: string;
    birthField: string;
    ageField: string;
    photoField: string;
    photoRegistered: string;
    photoNotRegistered: string;
    otherChildren: (n: number) => string;
    switchHint: string;
    birthdayToday: string;
    birthdayTomorrow: string;
    birthdayDays: (n: number) => string;
    ageNewborn: string;
    ageMonths: (m: number) => string;
    ageYearMonths: (y: number, m: number) => string;
    ageYears: (y: number) => string;
    deleteConfirm: (name: string) => string;
    changePhoto: string;
  };
  agenda: {
    title: string;
    subtitle: string;
    newAppointment: string;
    cancel: string;
    formTitle: string;
    dateLabel: string;
    timeLabel: string;
    locationLabel: string;
    locationPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    saveButton: string;
    saveChanges: string;
    upcomingTitle: string;
    pastTitle: string;
    allAppointments: (n: number) => string;
    noAppointments: string;
    noPastAppointments: string;
    noUpcomingAppointments: string;
    deleteConfirm: string;
    noChildSelected: string;
    editAppointment: string;
    statusFuture: string;
    statusToday: string;
    statusPast: string;
    months: string[];
    days: string[];
  };
  prescriptions: {
    title: string;
    subtitle: string;
    newFile: string;
    cancel: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    typeLabel: string;
    prescription: string;
    exam: string;
    dateLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    selectFileButton: string;
    saveButton: string;
    filterAll: string;
    filterPrescriptions: string;
    filterExams: string;
    noFiles: string;
    noChildSelected: string;
    deleteConfirm: (name: string) => string;
    download: string;
    delete: string;
  };
  growth: {
    title: string;
    subtitle: string;
    newMeasurement: string;
    cancel: string;
    formTitle: string;
    dateLabel: string;
    weightLabel: string;
    heightLabel: string;
    weightPlaceholder: string;
    heightPlaceholder: string;
    saveButton: string;
    lastWeight: string;
    lastHeight: string;
    measurementsLabel: string;
    records: string;
    historyTitle: string;
    weightChartTitle: string;
    heightChartTitle: string;
    noMeasurements: string;
    noChildSelected: string;
    deleteConfirm: string;
    weightUnit: string;
    heightUnit: string;
    weightTooltip: string;
    heightTooltip: string;
  };
  food: {
    title: string;
    subtitle: string;
    newMeal: string;
    cancel: string;
    formTitle: string;
    dateLabel: string;
    mealTypeLabel: string;
    servedLabel: string;
    servedPlaceholder: string;
    acceptanceLabel: string;
    notesLabel: string;
    notesPlaceholder: string;
    saveButton: string;
    noMeals: string;
    noChildSelected: string;
    mealTypes: string[];
    acceptance: string[];
    mealsCount: (n: number) => string;
    deleteConfirm: string;
  };
  vaccines: {
    title: string;
    subtitle: string;
    newVaccine: string;
    cancel: string;
    formTitle: string;
    vaccineLabel: string;
    selectVaccinePlaceholder: string;
    otherOption: string;
    customNameLabel: string;
    customNamePlaceholder: string;
    scheduledDateLabel: string;
    appliedDateLabel: string;
    statusLabel: string;
    appliedStatus: string;
    pendingStatus: string;
    reactionsLabel: string;
    reactionsPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    saveButton: string;
    filterAll: string;
    filterApplied: string;
    filterPending: string;
    appliedCard: string;
    pendingCard: string;
    progressTitle: string;
    progressPercent: string;
    progressCount: (applied: number, total: number) => string;
    noVaccines: string;
    noFilter: string;
    noChildSelected: string;
    deleteConfirm: string;
    cardTitle: string;
    cardSubtitle: string;
    attachCard: string;
    replaceCard: string;
    viewCard: string;
    deleteCard: string;
    deleteCardConfirm: string;
    uploadedOn: string;
    noCard: string;
    noCardHint: string;
    vaccinationCardFile: string;
  };
  contacts: {
    title: string;
    subtitle: string;
    newContact: string;
    cancel: string;
    formTitle: string;
    nameLabel: string;
    namePlaceholder: string;
    specialtyLabel: string;
    specialtyPlaceholder: string;
    phoneLabel: string;
    phonePlaceholder: string;
    emailLabel: string;
    emailPlaceholder: string;
    addressLabel: string;
    addressPlaceholder: string;
    notesLabel: string;
    notesPlaceholder: string;
    saveButton: string;
    noContacts: string;
    noContactsHint: string;
    sharedHint: (n: number) => string;
    deleteConfirm: (name: string) => string;
  };
  modal: {
    download: string;
    delete: string;
    close: string;
    deleteConfirm: (name: string) => string;
    prescription: string;
    exam: string;
    notAvailable: string;
    downloadFile: string;
    notesLabel: string;
  };
}

const ptBR: AppTranslations = {
  common: {
    save: 'Salvar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Excluir',
    close: 'Fechar',
    download: 'Baixar',
    add: 'Adicionar',
    all: 'Todos',
    date: 'Data',
    notes: 'Observações',
    selectChild: 'Selecione uma criança para continuar',
    noPreview: 'Pré-visualização não disponível',
    downloadFile: 'Baixar arquivo',
    uploadFile: 'Selecionar arquivo',
    locale: 'pt-BR',
  },
  sidebar: {
    childrenSection: 'Criança',
    noChildren: 'Nenhuma criança cadastrada',
    childNamePlaceholder: 'Nome da criança',
    addButton: 'Adicionar',
    cancelButton: 'Cancelar',
    savedLocally: 'Dados salvos localmente',
    languageLabel: 'Idioma',
    nav: {
      profile: 'Perfil',
      agenda: 'Agenda Médica',
      prescriptions: 'Receitas e Exames',
      growth: 'Curva de Crescimento',
      food: 'Rotina Alimentar',
      vaccines: 'Vacinas',
      contacts: 'Contatos de Saúde',
    },
  },
  profile: {
    title: 'Perfil da Criança',
    subtitle: 'Informações pessoais e foto',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    noChild: 'Nenhuma criança cadastrada',
    noChildSubtitle: 'Cadastre a primeira criança para começar',
    nameLabel: 'Nome completo',
    namePlaceholder: 'Ex: Maria Silva',
    birthDateLabel: 'Data de nascimento',
    registerButton: 'Cadastrar criança',
    summary: 'Resumo',
    nameField: 'Nome',
    birthField: 'Nascimento',
    ageField: 'Idade',
    photoField: 'Foto',
    photoRegistered: 'Cadastrada',
    photoNotRegistered: 'Não cadastrada',
    otherChildren: (n) => `Outras crianças (${n}/5)`,
    switchHint: 'Use o seletor na barra lateral para alternar',
    birthdayToday: 'Hoje é aniversário!',
    birthdayTomorrow: 'Amanhã é aniversário!',
    birthdayDays: (n) => `Aniversário em ${n} dias`,
    ageNewborn: 'Recém-nascido',
    ageMonths: (m) => `${m} ${m === 1 ? 'mês' : 'meses'}`,
    ageYearMonths: (y, m) => `${y} ano e ${m} ${m === 1 ? 'mês' : 'meses'}`,
    ageYears: (y) => `${y} anos`,
    deleteConfirm: (name) => `Excluir o perfil de ${name}? Todos os dados serão removidos.`,
    changePhoto: 'Alterar foto',
  },
  agenda: {
    title: 'Agenda Médica',
    subtitle: 'Consultas e compromissos de saúde',
    newAppointment: 'Nova consulta',
    cancel: 'Cancelar',
    formTitle: 'Nova Consulta',
    dateLabel: 'Data',
    timeLabel: 'Horário',
    locationLabel: 'Local / Médico',
    locationPlaceholder: 'Ex: Dr. João - Clínica Saúde',
    notesLabel: 'Observações',
    notesPlaceholder: 'Sintomas, motivo da consulta...',
    saveButton: 'Salvar consulta',
    saveChanges: 'Salvar alterações',
    upcomingTitle: 'Próximas consultas',
    pastTitle: 'Consultas passadas',
    allAppointments: (n) => `Todas as consultas (${n})`,
    noAppointments: 'Nenhuma consulta registrada',
    noPastAppointments: 'Nenhuma consulta passada',
    noUpcomingAppointments: 'Nenhuma consulta futura',
    deleteConfirm: 'Excluir esta consulta?',
    noChildSelected: 'Selecione uma criança para ver a agenda',
    editAppointment: 'Editar Consulta',
    statusFuture: 'Futura',
    statusToday: 'Hoje',
    statusPast: 'Passada',
    months: ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'],
    days: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  },
  prescriptions: {
    title: 'Receitas e Exames',
    subtitle: 'Arquivo de documentos médicos',
    newFile: 'Novo arquivo',
    cancel: 'Cancelar',
    formTitle: 'Novo arquivo',
    nameLabel: 'Nome do arquivo',
    namePlaceholder: 'Ex: Receita pediatra 03/2025',
    typeLabel: 'Tipo',
    prescription: 'Receita',
    exam: 'Exame',
    dateLabel: 'Data',
    notesLabel: 'Observações',
    notesPlaceholder: 'Medicamentos, dosagem, instruções...',
    selectFileButton: 'Selecionar arquivo',
    saveButton: 'Salvar arquivo',
    filterAll: 'Todos',
    filterPrescriptions: 'Receitas',
    filterExams: 'Exames',
    noFiles: 'Nenhum arquivo adicionado',
    noChildSelected: 'Selecione uma criança para ver os arquivos',
    deleteConfirm: (name) => `Excluir "${name}"?`,
    download: 'Baixar',
    delete: 'Excluir',
  },
  growth: {
    title: 'Curva de Crescimento',
    subtitle: 'Peso e altura ao longo do tempo',
    newMeasurement: 'Nova medição',
    cancel: 'Cancelar',
    formTitle: 'Nova medição',
    dateLabel: 'Data',
    weightLabel: 'Peso (kg)',
    heightLabel: 'Altura (cm)',
    weightPlaceholder: 'Ex: 8.5',
    heightPlaceholder: 'Ex: 72.0',
    saveButton: 'Salvar medição',
    lastWeight: 'Último Peso',
    lastHeight: 'Última Altura',
    measurementsLabel: 'Medições',
    records: 'registros',
    historyTitle: 'Histórico de Medições',
    weightChartTitle: 'Peso (kg)',
    heightChartTitle: 'Altura (cm)',
    noMeasurements: 'Nenhuma medição registrada',
    noChildSelected: 'Selecione uma criança para ver a curva de crescimento',
    deleteConfirm: 'Excluir esta medição?',
    weightUnit: 'kg',
    heightUnit: 'cm',
    weightTooltip: 'Peso',
    heightTooltip: 'Altura',
  },
  food: {
    title: 'Rotina Alimentar',
    subtitle: 'Diário de refeições e aceitação alimentar',
    newMeal: 'Registrar refeição',
    cancel: 'Cancelar',
    formTitle: 'Nova refeição',
    dateLabel: 'Data',
    mealTypeLabel: 'Tipo de refeição',
    servedLabel: 'O que foi servido',
    servedPlaceholder: 'Ex: Arroz, feijão, frango grelhado, salada',
    acceptanceLabel: 'Aceitação',
    notesLabel: 'Observações',
    notesPlaceholder: 'Reações, preferências, alergias...',
    saveButton: 'Salvar refeição',
    noMeals: 'Nenhuma refeição registrada',
    noChildSelected: 'Selecione uma criança para ver a rotina alimentar',
    mealTypes: ['Café da manhã', 'Lanche da manhã', 'Almoço', 'Lanche da tarde', 'Jantar', 'Ceia'],
    acceptance: ['Boa', 'Regular', 'Ruim', 'Recusou'],
    mealsCount: (n) => `${n} ${n !== 1 ? 'refeições' : 'refeição'}`,
    deleteConfirm: 'Excluir este registro?',
  },
  vaccines: {
    title: 'Histórico de Vacinas',
    subtitle: 'Controle das vacinas aplicadas e pendentes',
    newVaccine: 'Adicionar vacina',
    cancel: 'Cancelar',
    formTitle: 'Nova vacina',
    vaccineLabel: 'Vacina',
    selectVaccinePlaceholder: 'Selecione a vacina...',
    otherOption: 'Outra (digitar)',
    customNameLabel: 'Nome da vacina',
    customNamePlaceholder: 'Ex: Dengue',
    scheduledDateLabel: 'Data prevista',
    appliedDateLabel: 'Data de aplicação',
    statusLabel: 'Status',
    appliedStatus: 'Aplicada',
    pendingStatus: 'Pendente',
    reactionsLabel: 'Reações observadas',
    reactionsPlaceholder: 'Ex: Febre baixa, vermelhidão no local',
    notesLabel: 'Observações',
    notesPlaceholder: 'Local de aplicação, lote, etc.',
    saveButton: 'Salvar vacina',
    filterAll: 'Todas',
    filterApplied: 'Aplicadas',
    filterPending: 'Pendentes',
    appliedCard: 'Aplicadas',
    pendingCard: 'Pendentes',
    progressTitle: 'Progresso de vacinação',
    progressPercent: '%',
    progressCount: (a, t) => `${a} de ${t} vacinas aplicadas`,
    noVaccines: 'Nenhuma vacina registrada',
    noFilter: 'Nenhum resultado para esse filtro',
    noChildSelected: 'Selecione uma criança para ver o histórico de vacinas',
    deleteConfirm: 'Excluir esta vacina?',
    cardTitle: 'Carteira de Vacinação',
    cardSubtitle: 'Anexe a imagem ou PDF da carteira física',
    attachCard: 'Anexar Carteira',
    replaceCard: 'Substituir',
    viewCard: 'Ver Carteira',
    deleteCard: 'Remover',
    deleteCardConfirm: 'Remover a carteira de vacinação?',
    uploadedOn: 'Enviada em',
    noCard: 'Nenhuma carteira anexada',
    noCardHint: 'Anexe a imagem ou PDF da carteira de vacinação física',
    vaccinationCardFile: 'Carteira de Vacinação',
  },
  contacts: {
    title: 'Contatos de Saúde',
    subtitle: 'Profissionais e serviços de saúde',
    newContact: 'Novo contato',
    cancel: 'Cancelar',
    formTitle: 'Novo profissional',
    nameLabel: 'Nome completo',
    namePlaceholder: 'Ex: Dr. Maria Santos',
    specialtyLabel: 'Especialidade',
    specialtyPlaceholder: 'Ex: Pediatria',
    phoneLabel: 'Telefone / WhatsApp',
    phonePlaceholder: '(11) 99999-9999',
    emailLabel: 'E-mail',
    emailPlaceholder: 'exemplo@clinica.com',
    addressLabel: 'Endereço / Clínica',
    addressPlaceholder: 'Ex: Clínica Saúde – Rua das Flores, 123',
    notesLabel: 'Observações',
    notesPlaceholder: 'Horários de atendimento, convênios, etc.',
    saveButton: 'Salvar contato',
    noContacts: 'Nenhum contato cadastrado',
    noContactsHint: 'Os contatos são compartilhados entre todas as crianças',
    sharedHint: (n) => `${n} contato${n !== 1 ? 's' : ''} · compartilhados entre todas as crianças`,
    deleteConfirm: (name) => `Excluir o contato de ${name}?`,
  },
  modal: {
    download: 'Baixar',
    delete: 'Excluir',
    close: 'Fechar',
    deleteConfirm: (name) => `Excluir "${name}"?`,
    prescription: 'Receita',
    exam: 'Exame',
    notAvailable: 'Pré-visualização não disponível',
    downloadFile: 'Baixar arquivo',
    notesLabel: 'Obs',
  },
};

const en: AppTranslations = {
  common: {
    save: 'Save',
    cancel: 'Cancel',
    edit: 'Edit',
    delete: 'Delete',
    close: 'Close',
    download: 'Download',
    add: 'Add',
    all: 'All',
    date: 'Date',
    notes: 'Notes',
    selectChild: 'Select a child to continue',
    noPreview: 'Preview not available',
    downloadFile: 'Download file',
    uploadFile: 'Select file',
    locale: 'en-US',
  },
  sidebar: {
    childrenSection: 'Child',
    noChildren: 'No children registered',
    childNamePlaceholder: "Child's name",
    addButton: 'Add',
    cancelButton: 'Cancel',
    savedLocally: 'Data saved locally',
    languageLabel: 'Language',
    nav: {
      profile: 'Profile',
      agenda: 'Medical Agenda',
      prescriptions: 'Prescriptions & Exams',
      growth: 'Growth Curve',
      food: 'Food Routine',
      vaccines: 'Vaccines',
      contacts: 'Health Contacts',
    },
  },
  profile: {
    title: "Child's Profile",
    subtitle: 'Personal information and photo',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    noChild: 'No children registered',
    noChildSubtitle: 'Register the first child to get started',
    nameLabel: 'Full name',
    namePlaceholder: 'E.g.: Mary Smith',
    birthDateLabel: 'Date of birth',
    registerButton: 'Register child',
    summary: 'Summary',
    nameField: 'Name',
    birthField: 'Birth',
    ageField: 'Age',
    photoField: 'Photo',
    photoRegistered: 'Registered',
    photoNotRegistered: 'Not registered',
    otherChildren: (n) => `Other children (${n}/5)`,
    switchHint: 'Use the sidebar selector to switch',
    birthdayToday: 'Birthday today!',
    birthdayTomorrow: 'Birthday tomorrow!',
    birthdayDays: (n) => `Birthday in ${n} days`,
    ageNewborn: 'Newborn',
    ageMonths: (m) => `${m} ${m === 1 ? 'month' : 'months'}`,
    ageYearMonths: (y, m) => `${y} year and ${m} ${m === 1 ? 'month' : 'months'}`,
    ageYears: (y) => `${y} years old`,
    deleteConfirm: (name) => `Delete ${name}'s profile? All data will be removed.`,
    changePhoto: 'Change photo',
  },
  agenda: {
    title: 'Medical Agenda',
    subtitle: 'Appointments and health commitments',
    newAppointment: 'New appointment',
    cancel: 'Cancel',
    formTitle: 'New Appointment',
    dateLabel: 'Date',
    timeLabel: 'Time',
    locationLabel: 'Location / Doctor',
    locationPlaceholder: 'E.g.: Dr. John - Health Clinic',
    notesLabel: 'Notes',
    notesPlaceholder: 'Symptoms, reason for visit...',
    saveButton: 'Save appointment',
    saveChanges: 'Save changes',
    upcomingTitle: 'Upcoming appointments',
    pastTitle: 'Past appointments',
    allAppointments: (n) => `All appointments (${n})`,
    noAppointments: 'No appointments registered',
    noPastAppointments: 'No past appointments',
    noUpcomingAppointments: 'No upcoming appointments',
    deleteConfirm: 'Delete this appointment?',
    noChildSelected: 'Select a child to view the agenda',
    editAppointment: 'Edit Appointment',
    statusFuture: 'Upcoming',
    statusToday: 'Today',
    statusPast: 'Past',
    months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    days: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
  prescriptions: {
    title: 'Prescriptions & Exams',
    subtitle: 'Medical document archive',
    newFile: 'New file',
    cancel: 'Cancel',
    formTitle: 'New file',
    nameLabel: 'File name',
    namePlaceholder: 'E.g.: Pediatrician prescription 03/2025',
    typeLabel: 'Type',
    prescription: 'Prescription',
    exam: 'Exam',
    dateLabel: 'Date',
    notesLabel: 'Notes',
    notesPlaceholder: 'Medications, dosage, instructions...',
    selectFileButton: 'Select file',
    saveButton: 'Save file',
    filterAll: 'All',
    filterPrescriptions: 'Prescriptions',
    filterExams: 'Exams',
    noFiles: 'No files added',
    noChildSelected: 'Select a child to view files',
    deleteConfirm: (name) => `Delete "${name}"?`,
    download: 'Download',
    delete: 'Delete',
  },
  growth: {
    title: 'Growth Curve',
    subtitle: 'Weight and height over time',
    newMeasurement: 'New measurement',
    cancel: 'Cancel',
    formTitle: 'New measurement',
    dateLabel: 'Date',
    weightLabel: 'Weight (kg)',
    heightLabel: 'Height (cm)',
    weightPlaceholder: 'E.g.: 8.5',
    heightPlaceholder: 'E.g.: 72.0',
    saveButton: 'Save measurement',
    lastWeight: 'Last Weight',
    lastHeight: 'Last Height',
    measurementsLabel: 'Measurements',
    records: 'records',
    historyTitle: 'Measurement History',
    weightChartTitle: 'Weight (kg)',
    heightChartTitle: 'Height (cm)',
    noMeasurements: 'No measurements recorded',
    noChildSelected: 'Select a child to view the growth curve',
    deleteConfirm: 'Delete this measurement?',
    weightUnit: 'kg',
    heightUnit: 'cm',
    weightTooltip: 'Weight',
    heightTooltip: 'Height',
  },
  food: {
    title: 'Food Routine',
    subtitle: 'Meal diary and food acceptance',
    newMeal: 'Log meal',
    cancel: 'Cancel',
    formTitle: 'New meal',
    dateLabel: 'Date',
    mealTypeLabel: 'Meal type',
    servedLabel: 'What was served',
    servedPlaceholder: 'E.g.: Rice, beans, grilled chicken, salad',
    acceptanceLabel: 'Acceptance',
    notesLabel: 'Notes',
    notesPlaceholder: 'Reactions, preferences, allergies...',
    saveButton: 'Save meal',
    noMeals: 'No meals registered',
    noChildSelected: 'Select a child to view the food routine',
    mealTypes: ['Breakfast', 'Morning snack', 'Lunch', 'Afternoon snack', 'Dinner', 'Late snack'],
    acceptance: ['Good', 'Fair', 'Poor', 'Refused'],
    mealsCount: (n) => `${n} ${n !== 1 ? 'meals' : 'meal'}`,
    deleteConfirm: 'Delete this record?',
  },
  vaccines: {
    title: 'Vaccine History',
    subtitle: 'Control of applied and pending vaccines',
    newVaccine: 'Add vaccine',
    cancel: 'Cancel',
    formTitle: 'New vaccine',
    vaccineLabel: 'Vaccine',
    selectVaccinePlaceholder: 'Select vaccine...',
    otherOption: 'Other (type)',
    customNameLabel: 'Vaccine name',
    customNamePlaceholder: 'E.g.: Dengue',
    scheduledDateLabel: 'Scheduled date',
    appliedDateLabel: 'Date applied',
    statusLabel: 'Status',
    appliedStatus: 'Applied',
    pendingStatus: 'Pending',
    reactionsLabel: 'Observed reactions',
    reactionsPlaceholder: 'E.g.: Low fever, redness at site',
    notesLabel: 'Notes',
    notesPlaceholder: 'Application site, batch number, etc.',
    saveButton: 'Save vaccine',
    filterAll: 'All',
    filterApplied: 'Applied',
    filterPending: 'Pending',
    appliedCard: 'Applied',
    pendingCard: 'Pending',
    progressTitle: 'Vaccination progress',
    progressPercent: '%',
    progressCount: (a, t) => `${a} of ${t} vaccines applied`,
    noVaccines: 'No vaccines registered',
    noFilter: 'No results for this filter',
    noChildSelected: 'Select a child to view vaccine history',
    deleteConfirm: 'Delete this vaccine?',
    cardTitle: 'Vaccination Card',
    cardSubtitle: 'Attach the image or PDF of the physical card',
    attachCard: 'Attach Card',
    replaceCard: 'Replace',
    viewCard: 'View Card',
    deleteCard: 'Remove',
    deleteCardConfirm: 'Remove the vaccination card?',
    uploadedOn: 'Uploaded on',
    noCard: 'No card attached',
    noCardHint: 'Attach the image or PDF of the physical vaccination card',
    vaccinationCardFile: 'Vaccination Card',
  },
  contacts: {
    title: 'Health Contacts',
    subtitle: 'Healthcare professionals and services',
    newContact: 'New contact',
    cancel: 'Cancel',
    formTitle: 'New professional',
    nameLabel: 'Full name',
    namePlaceholder: 'E.g.: Dr. Mary Johnson',
    specialtyLabel: 'Specialty',
    specialtyPlaceholder: 'E.g.: Pediatrics',
    phoneLabel: 'Phone / WhatsApp',
    phonePlaceholder: '(11) 99999-9999',
    emailLabel: 'E-mail',
    emailPlaceholder: 'example@clinic.com',
    addressLabel: 'Address / Clinic',
    addressPlaceholder: 'E.g.: Health Clinic – 123 Flower St.',
    notesLabel: 'Notes',
    notesPlaceholder: 'Office hours, insurance plans, etc.',
    saveButton: 'Save contact',
    noContacts: 'No contacts registered',
    noContactsHint: 'Contacts are shared among all children',
    sharedHint: (n) => `${n} contact${n !== 1 ? 's' : ''} · shared among all children`,
    deleteConfirm: (name) => `Delete ${name}'s contact?`,
  },
  modal: {
    download: 'Download',
    delete: 'Delete',
    close: 'Close',
    deleteConfirm: (name) => `Delete "${name}"?`,
    prescription: 'Prescription',
    exam: 'Exam',
    notAvailable: 'Preview not available',
    downloadFile: 'Download file',
    notesLabel: 'Note',
  },
};

const es: AppTranslations = {
  common: {
    save: 'Guardar',
    cancel: 'Cancelar',
    edit: 'Editar',
    delete: 'Eliminar',
    close: 'Cerrar',
    download: 'Descargar',
    add: 'Agregar',
    all: 'Todos',
    date: 'Fecha',
    notes: 'Observaciones',
    selectChild: 'Selecciona un niño para continuar',
    noPreview: 'Vista previa no disponible',
    downloadFile: 'Descargar archivo',
    uploadFile: 'Seleccionar archivo',
    locale: 'es-ES',
  },
  sidebar: {
    childrenSection: 'Niño',
    noChildren: 'Ningún niño registrado',
    childNamePlaceholder: 'Nombre del niño',
    addButton: 'Agregar',
    cancelButton: 'Cancelar',
    savedLocally: 'Datos guardados localmente',
    languageLabel: 'Idioma',
    nav: {
      profile: 'Perfil',
      agenda: 'Agenda Médica',
      prescriptions: 'Recetas y Exámenes',
      growth: 'Curva de Crecimiento',
      food: 'Rutina Alimentaria',
      vaccines: 'Vacunas',
      contacts: 'Contactos de Salud',
    },
  },
  profile: {
    title: 'Perfil del Niño',
    subtitle: 'Información personal y foto',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    noChild: 'Ningún niño registrado',
    noChildSubtitle: 'Registra al primer niño para comenzar',
    nameLabel: 'Nombre completo',
    namePlaceholder: 'Ej: María García',
    birthDateLabel: 'Fecha de nacimiento',
    registerButton: 'Registrar niño',
    summary: 'Resumen',
    nameField: 'Nombre',
    birthField: 'Nacimiento',
    ageField: 'Edad',
    photoField: 'Foto',
    photoRegistered: 'Registrada',
    photoNotRegistered: 'No registrada',
    otherChildren: (n) => `Otros niños (${n}/5)`,
    switchHint: 'Usa el selector en la barra lateral para cambiar',
    birthdayToday: '¡Hoy es su cumpleaños!',
    birthdayTomorrow: '¡Mañana es su cumpleaños!',
    birthdayDays: (n) => `Cumpleaños en ${n} días`,
    ageNewborn: 'Recién nacido',
    ageMonths: (m) => `${m} ${m === 1 ? 'mes' : 'meses'}`,
    ageYearMonths: (y, m) => `${y} año y ${m} ${m === 1 ? 'mes' : 'meses'}`,
    ageYears: (y) => `${y} años`,
    deleteConfirm: (name) => `¿Eliminar el perfil de ${name}? Todos los datos serán eliminados.`,
    changePhoto: 'Cambiar foto',
  },
  agenda: {
    title: 'Agenda Médica',
    subtitle: 'Citas y compromisos de salud',
    newAppointment: 'Nueva cita',
    cancel: 'Cancelar',
    formTitle: 'Nueva Cita',
    dateLabel: 'Fecha',
    timeLabel: 'Hora',
    locationLabel: 'Lugar / Médico',
    locationPlaceholder: 'Ej: Dr. Juan - Clínica Salud',
    notesLabel: 'Observaciones',
    notesPlaceholder: 'Síntomas, motivo de la consulta...',
    saveButton: 'Guardar cita',
    saveChanges: 'Guardar cambios',
    upcomingTitle: 'Próximas citas',
    pastTitle: 'Citas pasadas',
    allAppointments: (n) => `Todas las citas (${n})`,
    noAppointments: 'Ninguna cita registrada',
    noPastAppointments: 'Ninguna cita pasada',
    noUpcomingAppointments: 'Ninguna cita futura',
    deleteConfirm: '¿Eliminar esta cita?',
    noChildSelected: 'Selecciona un niño para ver la agenda',
    editAppointment: 'Editar Cita',
    statusFuture: 'Futura',
    statusToday: 'Hoy',
    statusPast: 'Pasada',
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    days: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'],
  },
  prescriptions: {
    title: 'Recetas y Exámenes',
    subtitle: 'Archivo de documentos médicos',
    newFile: 'Nuevo archivo',
    cancel: 'Cancelar',
    formTitle: 'Nuevo archivo',
    nameLabel: 'Nombre del archivo',
    namePlaceholder: 'Ej: Receta pediatra 03/2025',
    typeLabel: 'Tipo',
    prescription: 'Receta',
    exam: 'Examen',
    dateLabel: 'Fecha',
    notesLabel: 'Observaciones',
    notesPlaceholder: 'Medicamentos, dosis, instrucciones...',
    selectFileButton: 'Seleccionar archivo',
    saveButton: 'Guardar archivo',
    filterAll: 'Todos',
    filterPrescriptions: 'Recetas',
    filterExams: 'Exámenes',
    noFiles: 'Ningún archivo agregado',
    noChildSelected: 'Selecciona un niño para ver los archivos',
    deleteConfirm: (name) => `¿Eliminar "${name}"?`,
    download: 'Descargar',
    delete: 'Eliminar',
  },
  growth: {
    title: 'Curva de Crecimiento',
    subtitle: 'Peso y altura a lo largo del tiempo',
    newMeasurement: 'Nueva medición',
    cancel: 'Cancelar',
    formTitle: 'Nueva medición',
    dateLabel: 'Fecha',
    weightLabel: 'Peso (kg)',
    heightLabel: 'Altura (cm)',
    weightPlaceholder: 'Ej: 8.5',
    heightPlaceholder: 'Ej: 72.0',
    saveButton: 'Guardar medición',
    lastWeight: 'Último Peso',
    lastHeight: 'Última Altura',
    measurementsLabel: 'Mediciones',
    records: 'registros',
    historyTitle: 'Historial de Mediciones',
    weightChartTitle: 'Peso (kg)',
    heightChartTitle: 'Altura (cm)',
    noMeasurements: 'Ninguna medición registrada',
    noChildSelected: 'Selecciona un niño para ver la curva de crecimiento',
    deleteConfirm: '¿Eliminar esta medición?',
    weightUnit: 'kg',
    heightUnit: 'cm',
    weightTooltip: 'Peso',
    heightTooltip: 'Altura',
  },
  food: {
    title: 'Rutina Alimentaria',
    subtitle: 'Diario de comidas y aceptación alimentaria',
    newMeal: 'Registrar comida',
    cancel: 'Cancelar',
    formTitle: 'Nueva comida',
    dateLabel: 'Fecha',
    mealTypeLabel: 'Tipo de comida',
    servedLabel: 'Qué se sirvió',
    servedPlaceholder: 'Ej: Arroz, frijoles, pollo a la plancha, ensalada',
    acceptanceLabel: 'Aceptación',
    notesLabel: 'Observaciones',
    notesPlaceholder: 'Reacciones, preferencias, alergias...',
    saveButton: 'Guardar comida',
    noMeals: 'Ninguna comida registrada',
    noChildSelected: 'Selecciona un niño para ver la rutina alimentaria',
    mealTypes: ['Desayuno', 'Merienda de mañana', 'Almuerzo', 'Merienda de tarde', 'Cena', 'Cena tardía'],
    acceptance: ['Buena', 'Regular', 'Mala', 'Rechazó'],
    mealsCount: (n) => `${n} ${n !== 1 ? 'comidas' : 'comida'}`,
    deleteConfirm: '¿Eliminar este registro?',
  },
  vaccines: {
    title: 'Historial de Vacunas',
    subtitle: 'Control de vacunas aplicadas y pendientes',
    newVaccine: 'Agregar vacuna',
    cancel: 'Cancelar',
    formTitle: 'Nueva vacuna',
    vaccineLabel: 'Vacuna',
    selectVaccinePlaceholder: 'Selecciona la vacuna...',
    otherOption: 'Otra (escribir)',
    customNameLabel: 'Nombre de la vacuna',
    customNamePlaceholder: 'Ej: Dengue',
    scheduledDateLabel: 'Fecha programada',
    appliedDateLabel: 'Fecha de aplicación',
    statusLabel: 'Estado',
    appliedStatus: 'Aplicada',
    pendingStatus: 'Pendiente',
    reactionsLabel: 'Reacciones observadas',
    reactionsPlaceholder: 'Ej: Fiebre baja, enrojecimiento en el sitio',
    notesLabel: 'Observaciones',
    notesPlaceholder: 'Lugar de aplicación, lote, etc.',
    saveButton: 'Guardar vacuna',
    filterAll: 'Todas',
    filterApplied: 'Aplicadas',
    filterPending: 'Pendientes',
    appliedCard: 'Aplicadas',
    pendingCard: 'Pendientes',
    progressTitle: 'Progreso de vacunación',
    progressPercent: '%',
    progressCount: (a, t) => `${a} de ${t} vacunas aplicadas`,
    noVaccines: 'Ninguna vacuna registrada',
    noFilter: 'Ningún resultado para este filtro',
    noChildSelected: 'Selecciona un niño para ver el historial de vacunas',
    deleteConfirm: '¿Eliminar esta vacuna?',
    cardTitle: 'Carnet de Vacunación',
    cardSubtitle: 'Adjunta la imagen o PDF del carnet físico',
    attachCard: 'Adjuntar Carnet',
    replaceCard: 'Reemplazar',
    viewCard: 'Ver Carnet',
    deleteCard: 'Eliminar',
    deleteCardConfirm: '¿Eliminar el carnet de vacunación?',
    uploadedOn: 'Subido el',
    noCard: 'Ningún carnet adjunto',
    noCardHint: 'Adjunta la imagen o PDF del carnet de vacunación físico',
    vaccinationCardFile: 'Carnet de Vacunación',
  },
  contacts: {
    title: 'Contactos de Salud',
    subtitle: 'Profesionales y servicios de salud',
    newContact: 'Nuevo contacto',
    cancel: 'Cancelar',
    formTitle: 'Nuevo profesional',
    nameLabel: 'Nombre completo',
    namePlaceholder: 'Ej: Dra. María García',
    specialtyLabel: 'Especialidad',
    specialtyPlaceholder: 'Ej: Pediatría',
    phoneLabel: 'Teléfono / WhatsApp',
    phonePlaceholder: '(11) 99999-9999',
    emailLabel: 'Correo electrónico',
    emailPlaceholder: 'ejemplo@clinica.com',
    addressLabel: 'Dirección / Clínica',
    addressPlaceholder: 'Ej: Clínica Salud – Calle Flores, 123',
    notesLabel: 'Observaciones',
    notesPlaceholder: 'Horarios de atención, seguros médicos, etc.',
    saveButton: 'Guardar contacto',
    noContacts: 'Ningún contacto registrado',
    noContactsHint: 'Los contactos son compartidos entre todos los niños',
    sharedHint: (n) => `${n} contacto${n !== 1 ? 's' : ''} · compartidos entre todos los niños`,
    deleteConfirm: (name) => `¿Eliminar el contacto de ${name}?`,
  },
  modal: {
    download: 'Descargar',
    delete: 'Eliminar',
    close: 'Cerrar',
    deleteConfirm: (name) => `¿Eliminar "${name}"?`,
    prescription: 'Receta',
    exam: 'Examen',
    notAvailable: 'Vista previa no disponible',
    downloadFile: 'Descargar archivo',
    notesLabel: 'Nota',
  },
};

export const translations: Record<Language, AppTranslations> = {
  'pt-BR': ptBR,
  'en': en,
  'es': es,
};
