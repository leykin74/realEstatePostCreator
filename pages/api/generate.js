import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export default async function (req, res) {
  const rooms = req.body.rooms || '';
  const address = req.body.address || '';
  const documents = req.body.documents || '';
  const apartments = req.body.apartments || '';
  const house = req.body.house || '';

  const template = 'Продaем СВЕТЛУЮ квартиру-студию C ОТДEЛКОЙ в нoвoм ЖK комфорт-клaсca Opлoвский парк.\n\nKcтaти, если Вы ceйчас пpoдаeтe свoю нeдвижимость, то мы можем cpaзу ВЫKУПИТЬ eё или OБMEНЯТЬ.\n\nБудем pады юpидичeски coпpoводить Вашу cдeлку, деятельность нашeго aгeнтcтва застрaховaна на 20 000 000 рублей. Будем рады покупкам с нами и у нас!)\n\n.\n\n! Продажа БЕЗ КОМИССИИ !\n\nОписание и фотографии соответствуют действительности!\n\n.\n\nПРО ДОКУМЕНТЫ:\n\nМой клиент - первый и единственный СОВЕРШЕННОЛЕТНИЙ собственник, приобретал у застройщика по договору долевого участия в 2021 году. Квартира БЕЗ ПЕРЕПЛАНИРОВОК. Никто НЕ ПРОПИСАН. Мы в ПРЯМОЙ ПРОДАЖЕ, поэтому готовы сразу выходить на сделку и с удовольствием ПОКАЖЕМ ВСЕ ДОКУМЕНТЫ. Квартира ПОДХОДИТ ПОД ИПОТЕКУ, при необходимости поможем вам с одобрением.\n\n.\n\nПРО КВАРТИРУ:\n\nОчень СВЕТЛАЯ квартира-студия с удобной планировкой: просторная жилая площадью, правильной прямоугольной формы, большой коридор. КАЧЕСТВЕННАЯ ОТДЕЛКА ОТ ЗАСТРОЙЩИКА, на полу в коридоре и на кухне плитка, в комнате ламинат. Натяжные потолки, обои под покраску. Совмещенный с/у с душем, полностью отделан кафелем. БОЛЬШИЕ ОКНА С ЗАЩИТОЙ ОТ ДЕТЕЙ, выходят в тихий двор. Имеются ниши для кондиционеров.\n\n.\n\nПРО ДОМ И ИНФРАСТРУКТУРУ:\n\nМонолитный дом комфорт-класса 2019 г.п. В парадной 3 грузовых лифтов, дизайнерская отделка, два входа. На -1 этаже кладовые помещения. Система охраны, видеонаблюдения и контроля доступа, в доме и на всей территории.\n\n Также на территории ЖК располагается детский сад и школа, несколько ЗАКРЫТЫХ ПАРКИНГОВ, множество торговых площадей и различных сфер услуг. Между домами разбиты мини-парки с высаженными деревьями и цветниками, обустроенные прогулочные дорожки и комфортные места для отдыха для разных возрастов.\n\nВ шаговой доступности Новоорловский заказник, Суздальские озёра и Шуваловский парк.\n\n.\n\nДо станций метро «Проспект Просвещения», «Озерки», а также до КАД и ЗСД — 10 мин. на транспорте. До центра города на машине около 40 минут.\n\n.Торг уместен :) \n\nПРОКОНСУЛЬТИРУЕМ по сделке. Звоните!';

  if (rooms.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Введите количество комнат",
      }
    });
    return;
  }
  if (address.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Введите адрес",
      }
    });
    return;
  }
  if (documents.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Введите описание документов",
      }
    });
    return;
  }
  if (apartments.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Введите описаниие квартиры",
      }
    });
    return;
  }
  if (house.trim().length === 0) {
    res.status(400).json({
      error: {
        message: "Введите описание дом, жк",
      }
    });
    return;
  }

  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: generatePrompt(rooms, address, documents, apartments, house, template) }],
      model: "gpt-3.5-turbo",
    });
    console.log(completion);  // Log the entire response object
    
    res.status(200).json({ message: completion.choices[0] });
   
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(_rooms, _address, _documents, _apartments, _house, _template) {
  return `на основе шаблона: ${_template} --тут конец шаблона-- создай объевление о продаже квартиры! вот данные о квартире: количество комнат : ${_rooms}, адрес: ${_address}, информация о документах (если есть обременение или занижение про это не пишем, если этого нет, то обязательно пишем что нет, как и все остальное): ${_documents}, описаниие квартиры: ${_apartments}, описание дома и/или жилого комплекса: ${_house}`;

}
