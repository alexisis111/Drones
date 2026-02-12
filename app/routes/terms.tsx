import type { Route } from "./+types/legal";
import { useTheme } from "../contexts/ThemeContext";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Условия использования - ООО «ЛЕГИОН»" },
    { name: "description", content: "Условия использования сайта ООО «ЛЕГИОН»" },
  ];
}

export default function TermsOfService() {
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
          }`}>Условия использования</h1>
          
          <div className="prose max-w-none">
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Пожалуйста, внимательно ознакомьтесь с настоящими условиями использования перед использованием веб-сайта ООО "ЛЕГИОН".
            </p>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Принятие условий</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Используя этот сайт, вы соглашаетесь с соблюдением настоящих условий использования. Если вы не согласны с этими условиями, пожалуйста, не используйте наш сайт.
            </p>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Изменения условий</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              ООО "ЛЕГИОН" оставляет за собой право вносить изменения в настоящие условия использования в любое время. Изменения вступают в силу с момента их публикации на сайте.
            </p>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Использование сайта</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Вы обязуетесь использовать сайт только в законных целях и в соответствии с применимыми законами и правилами.
            </p>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Запрещается:
            </p>
            <ul className={`list-disc pl-6 mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              <li>Использовать сайт для незаконной деятельности</li>
              <li>Предпринимать попытки получения несанкционированного доступа к системам компании</li>
              <li>Использовать автоматизированные средства для сбора информации с сайта</li>
            </ul>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Ограничение ответственности</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              ООО "ЛЕГИОН" не несет ответственности за убытки, возникшие в результате использования или невозможности использования нашего сайта.
            </p>
            
            <h2 className={`text-xl font-semibold mt-6 mb-3 ${
              theme === 'dark' ? 'text-white' : 'text-gray-900'
            }`}>Контактная информация</h2>
            <p className={`mb-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Если у вас есть вопросы относительно этих условий использования, пожалуйста, свяжитесь с нами через форму обратной связи на сайте.
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