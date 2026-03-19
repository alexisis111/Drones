import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Данные прайс-листа с описаниями
const priceList = [
  {
    name: "Разборка зданий и сооружений",
    price: "от 180 ₽/м³",
    description: "Демонтаж зданий, удаление конструкций"
  },
  {
    name: "Сборка лесов",
    price: "от 150 ₽/м²",
    description: "Монтаж наружных и внутренних лесов"
  },
  {
    name: "Подготовка строительного участка",
    price: "от 12 000 ₽/сотка",
    description: "Очистка территории, разметка, подведение коммуникаций"
  },
  {
    name: "Изготовление металлоконструкций",
    price: "от 80 000 ₽/т",
    description: "Производство металлических конструкций любой сложности"
  },
  { 
    name: "Монтаж технологических трубопроводов", 
    price: "от 450 ₽/п.м.",
    description: "Установка и ремонт технологических трубопроводов"
  },
  { 
    name: "Монтаж технологических площадок", 
    price: "от 2 500 ₽/м²",
    description: "Устройство площадок для обслуживания оборудования"
  },
  { 
    name: "Антикоррозийная защита", 
    price: "от 250 ₽/м²",
    description: "Защита металлических и бетонных конструкций от коррозии"
  },
  { 
    name: "Устройство каменных конструкций", 
    price: "от 1 800 ₽/м²",
    description: "Кладка кирпича, устройство блочных стен, армирование"
  },
  { 
    name: "Устройство фундаментов", 
    price: "от 4 500 ₽/м³",
    description: "Монолитные фундаменты, ремонт, гидроизоляция"
  },
  { 
    name: "Монтаж сборного железобетона", 
    price: "от 2 500 ₽/м³",
    description: "Монтаж ЖБИ, монолитные работы, крепление конструкций"
  },
  { 
    name: "Теплоизоляция оборудования", 
    price: "от 450 ₽/м²",
    description: "Изоляция оборудования, энергосбережение, снижение теплопотерь"
  },
  { 
    name: "Теплоизоляция трубопроводов", 
    price: "от 450 ₽/м²",
    description: "Изоляция трубопроводов, защита от промерзания"
  },
  { 
    name: "Земляные работы", 
    price: "от 350 ₽/м³",
    description: "Рытье котлованов, траншей, обратная засыпка, вывоз грунта"
  },
  { 
    name: "Строительство ангаров", 
    price: "от 10 000 ₽/м²",
    description: "Проектирование, монтаж каркаса, обшивка сэндвич-панелями"
  },
  { 
    name: "Грузоперевозки", 
    price: "от 600 ₽/час",
    description: "Перевозка материалов, доставка оборудования, логистика"
  },
  { 
    name: "Огнезащита конструкций", 
    price: "от 450 ₽/м²",
    description: "Обработка металла и дерева огнезащитными составами"
  }
];

// Контактная информация
const companyInfo = {
  name: "ООО «ЛЕГИОН»",
  phone: "+7 931 247-08-88",
  email: "l-legion@bk.ru",
  address: "Ленинградская область, г. Светогорск, ул. Максима Горького, 7",
  website: "https://легион78.рф"
};

// Создаём документ
const doc = new PDFDocument({
  size: 'A4',
  margins: {
    top: 40,
    bottom: 40,
    left: 40,
    right: 40
  }
});

// Путь к файлу
const outputPath = path.join(__dirname, '..', 'public', 'price-list.pdf');

// Сохраняем PDF
doc.pipe(fs.createWriteStream(outputPath));

// Регистрируем шрифты с поддержкой кириллицы (Arial для Windows)
const fontPath = 'C:/Windows/Fonts/arial.ttf';
const fontBoldPath = 'C:/Windows/Fonts/arialbd.ttf';

// === ШАПКА ===
doc.fontSize(22)
   .font(fontBoldPath)
   .fillColor('#1e40af')
   .text(companyInfo.name, { align: 'center' });

doc.fontSize(11)
   .font(fontPath)
   .fillColor('#374151')
   .text('Строительная компания', { align: 'center' });

doc.moveDown(0.5);

// Разделительная линия
doc.moveTo(40, doc.y)
   .lineTo(550, doc.y)
   .strokeColor('#1e40af')
   .lineWidth(2);

doc.moveDown(1);

// === БЛОК ЗОК (ЗАЩИТА ОТ БПЛА) ===
const zokBoxTop = doc.y;
const zokBoxHeight = 110;

// Фон блока с градиентным эффектом (синий)
doc.roundedRect(40, zokBoxTop, 510, zokBoxHeight, 8)
   .fill('#1e3a8a');

// Декоративная рамка
doc.roundedRect(38, zokBoxTop - 2, 514, zokBoxHeight + 4, 10)
   .stroke('#3b82f6')
   .lineWidth(2);

// Заголовок ЗОК
doc.fontSize(14)
   .font(fontBoldPath)
   .fillColor('#ffffff')
   .text('ЗАЩИТА ОТ БПЛА — 3 УРОВНЯ ЗАЩИТЫ', 50, zokBoxTop + 12, {
     width: 490,
     align: 'center'
   });

// Подзаголовок
doc.fontSize(9)
   .font(fontPath)
   .fillColor('#93c5fd')
   .text('Комплексная система защиты периметра от беспилотных летательных аппаратов', 50, zokBoxTop + 32, {
     width: 490,
     align: 'center'
   });

// Три уровня защиты
const levelsY = zokBoxTop + 52;
doc.fontSize(8)
   .font(fontBoldPath)
   .fillColor('#ffffff');

// Уровень 1
doc.text('ПРОЕКТИРОВАНИЕ', 50, levelsY, {
  width: 160,
  align: 'center'
});
doc.fontSize(7)
   .font(fontPath)
   .fillColor('#dbeafe')
   .text('Индивидуальный расчёт под объект', 50, levelsY + 10, {
     width: 160,
     align: 'center'
   });

// Уровень 2
doc.fontSize(8)
   .font(fontBoldPath)
   .fillColor('#ffffff')
   .text('МОНТАЖ', 215, levelsY, {
     width: 160,
     align: 'center'
   });
doc.fontSize(7)
   .font(fontPath)
   .fillColor('#dbeafe')
   .text('Быстровозводимые конструкции', 215, levelsY + 10, {
     width: 160,
     align: 'center'
   });

// Уровень 3
doc.fontSize(8)
   .font(fontBoldPath)
   .fillColor('#ffffff')
   .text('СЕРВИС', 380, levelsY, {
     width: 160,
     align: 'center'
   });
doc.fontSize(7)
   .font(fontPath)
   .fillColor('#dbeafe')
   .text('Поддержка на всём цикле', 380, levelsY + 10, {
     width: 160,
     align: 'center'
   });

// Разделители между уровнями
doc.moveTo(205, levelsY - 5)
   .lineTo(205, levelsY + 35)
   .stroke('#3b82f6')
   .lineWidth(1);

doc.moveTo(370, levelsY - 5)
   .lineTo(370, levelsY + 35)
   .stroke('#3b82f6')
   .lineWidth(1);

// Преимущества внизу блока
const benefitsY = zokBoxTop + 92;
doc.fontSize(7.5)
   .font(fontBoldPath)
   .fillColor('#ffffff')
   .text('Стальной каркас с сеткой  |  Антикоррозийное покрытие  |  Гарантия до 5 лет', 50, benefitsY, {
     width: 490,
     align: 'center'
   });

doc.moveDown(1.2);

// Разделительная линия после ЗОК
doc.moveTo(40, doc.y)
   .lineTo(550, doc.y)
   .strokeColor('#3b82f6')
   .lineWidth(1);

doc.moveDown(0.8);

// === ЗАГОЛОВОК ПРАЙС-ЛИСТА ===
doc.fontSize(16)
   .font(fontBoldPath)
   .fillColor('#111827')
   .text('ПРАЙС-ЛИСТ НА УСЛУГИ', { align: 'center' });

doc.fontSize(9)
   .font(fontPath)
   .fillColor('#6b7280')
   .text('Актуальные цены на строительные услуги', { align: 'center' });

doc.moveDown(1.5);

// === ТАБЛИЦА ===
let currentY = doc.y;
const tableLeft = 40;
const nameColWidth = 220;      // Уменьшили с 280 до 220
const descColWidth = 200;      // Уменьшили с 230 до 200
const priceColWidth = 85;      // Уменьшили с 95 до 85
// Общая ширина: 220 + 200 + 85 = 505 (вписываемся в 510)

// Заголовок таблицы
doc.fontSize(10)
   .font(fontBoldPath)
   .fillColor('#ffffff');

// Фон заголовка
doc.rect(tableLeft, currentY - 5, nameColWidth, 22)
   .fill('#1e40af');
doc.rect(tableLeft + nameColWidth, currentY - 5, descColWidth, 22)
   .fill('#1e40af');
doc.rect(tableLeft + nameColWidth + descColWidth, currentY - 5, priceColWidth, 22)
   .fill('#1e40af');

// Текст заголовка
doc.fillColor('#ffffff')
   .text('Услуга', tableLeft + 8, currentY, {
     width: nameColWidth - 16,
     align: 'left'
   });

doc.text('Описание', tableLeft + nameColWidth + 8, currentY, {
  width: descColWidth - 16,
  align: 'left'
});

doc.text('Цена', tableLeft + nameColWidth + descColWidth + 8, currentY, {
  width: priceColWidth - 16,
  align: 'left'
});

// Линия под заголовком
doc.moveTo(tableLeft, currentY + 17)
   .lineTo(tableLeft + nameColWidth + descColWidth + priceColWidth, currentY + 17)
   .strokeColor('#1e40af')
   .lineWidth(1);

currentY += 28;

// Строки таблицы
priceList.forEach((item, index) => {
  doc.fontSize(9)
     .font(fontPath)
     .fillColor('#1f2937');
  
  // Чередование цветов строк
  if (index % 2 === 0) {
    doc.rect(tableLeft, currentY - 3, nameColWidth + descColWidth + priceColWidth, 22)
       .fill('#fafafa');  // Очень светлый серый
  }
  
  // Название услуги
  doc.font(fontBoldPath)
     .fontSize(9)
     .fillColor('#000000')  // Чёрный цвет
     .text(item.name, tableLeft + 8, currentY, {
       width: nameColWidth - 16,
       align: 'left'
     });
  
  // Описание
  doc.font(fontPath)
     .fontSize(8)
     .fillColor('#1f2937')  // Тёмно-серый для описания
     .text(item.description, tableLeft + nameColWidth + 8, currentY, {
       width: descColWidth - 16,
       align: 'left',
       ellipsis: true
     });
  
  // Цена
  doc.font(fontBoldPath)
     .fontSize(9)
     .fillColor('#047857')  // Более тёмный зелёный
     .text(item.price, tableLeft + nameColWidth + descColWidth + 8, currentY, {
       width: priceColWidth - 16,
       align: 'left'
     });
  
  // Линия под строкой
  doc.moveTo(tableLeft, currentY + 18)
     .lineTo(tableLeft + nameColWidth + descColWidth + priceColWidth, currentY + 18)
     .strokeColor('#e5e7eb')
     .lineWidth(0.5);
  
  currentY += 25;
  
  // Новая страница если нужно
  if (currentY > 720) {
    doc.addPage();
    currentY = 40;
  }
});

// === ПОДВАЛ ===
// Новая страница для подвала если нужно
if (currentY > 650) {
  doc.addPage();
  currentY = 50;
}

doc.moveDown(1);

// Разделительная линия
const footerTop = doc.y;
doc.moveTo(40, footerTop)
   .lineTo(550, footerTop)
   .strokeColor('#1e40af')
   .lineWidth(1);

doc.moveDown(1.5);

// Контактная информация
doc.fontSize(11)
   .font(fontBoldPath)
   .fillColor('#000000')  // Чёрный цвет
   .text('Контактная информация:', 40, doc.y);  // Явно указываем координаты

doc.moveDown(0.8);

// Контакты - слева
doc.fontSize(9)
   .font(fontPath)
   .fillColor('#000000');  // Чёрный цвет

doc.text(`Телефон: ${companyInfo.phone}`, 40, doc.y);
doc.text(`Email: ${companyInfo.email}`, 40, doc.y);
doc.text(`Адрес: ${companyInfo.address}`, 40, doc.y);
doc.text(`Сайт: ${companyInfo.website}`, 40, doc.y);

doc.moveDown(1.5);

// Примечание - на всю ширину
doc.fontSize(8)
   .font(fontPath)
   .fillColor('#9ca3af')
   .text('* Цены указаны в ознакомительных целях и не являются публичной офертой. ' +
         'Для получения точного расчёта стоимости свяжитесь с нашими менеджерами.', {
     align: 'center',
     width: 510
   });

// Номер страницы
doc.fontSize(7)
   .font(fontPath)
   .fillColor('#9ca3af')
   .text('Страница 1', 40, 790, {
     width: 510,
     align: 'right'
   });

// Завершаем создание PDF
doc.end();

console.log(`✅ PDF успешно создан: ${outputPath}`);
console.log(`📄 Количество услуг: ${priceList.length}`);
console.log(`📍 Расположение: public/price-list.pdf`);
