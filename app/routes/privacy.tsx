import type { Route } from "./+types/legal";
import { useTheme } from "../contexts/ThemeContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Политика конфиденциальности - ООО «ЛЕГИОН»" },
    { name: "description", content: "Политика конфиденциальности ООО «ЛЕГИОН»" },
  ];
}

export default function PrivacyPolicy() {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen py-12 px-4 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-4xl mx-auto">
        <div className={`rounded-2xl p-8 shadow-lg ${
          theme === 'dark'
            ? 'bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700'
            : 'bg-gradient-to-br from-white to-gray-100 border border-gray-200'
        }`}>
          <h1 className={`text-3xl font-bold mb-6 ${
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          }`}>Политика конфиденциальности</h1>
          
          <div className="prose max-w-none">
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Настоящая политика конфиденциальности определяет, как ООО "ЛЕГИОН" собирает, использует, раскрывает и защищает информацию, которую вы предоставляете при использовании нашего веб-сайта.
            </p>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Информация, которую мы собираем</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Мы можем собирать информацию, когда вы оставляете заявку на обратный звонок, отправляете форму контакта или в другое время на сайте. В зависимости от обстоятельств, мы можем собирать:
            </p>
            <ul className={`list-disc pl-6 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Ваше имя</li>
              <li>Контактный телефон</li>
              <li>Адрес электронной почты</li>
              <li>Другую контактную информацию</li>
            </ul>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Как мы используем вашу информацию</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Мы используем собранную информацию для:
            </p>
            <ul className={`list-disc pl-6 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Обработки ваших запросов и оказания услуг</li>
              <li>Отправки информации о наших продуктах и услугах</li>
              <li>Связи с вами для административных или маркетинговых целей</li>
            </ul>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Защита вашей информации</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Мы принимаем соответствующие меры безопасности для защиты вашей личной информации. Мы используем передовые технологии и методы для обеспечения конфиденциальности и безопасности ваших данных.
            </p>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Изменения в политике конфиденциальности</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Мы оставляем за собой право вносить изменения в настоящую политику конфиденциальности в любое время. Любые изменения будут опубликованы на этой странице.
            </p>
            
            <p className={`mt-6 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Последнее обновление: {new Date().toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}