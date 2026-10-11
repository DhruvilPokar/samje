import type {
  SamajPerson,
  EventPhoto,
  CalendarEvent,
} from '../types';

export const SAMAJ_DETAILS = {
  nameGuj: 'શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ',
  nameEng: 'Shree Kalol Kutch Kadva Patidar Samaj',
  taglineGuj: 'સંગઠન • સંસ્કાર • સમૃદ્ધિ • સેવા',
  taglineEng: 'Unity • Character • Prosperity • Selfless Service',
  regNumber: 'નોંધણી ક્રમાંક: એ-૪૨૦ / ગાંધીનગર (સ્થાપના: ૧૯૮૧)',
  kuldeviGuj: 'જગતજનની કુળદેવી શ્રી ઉમિયા માતાજી',
  kuldeviEng: 'Kuldevi Maa Umiya Blessings',
  addressGuj: 'શ્રી કચ્છ કડવા પાટીદાર સમાજ ભવન, બોરીસણા રોડ, કલોલ - ૩૮૨૭૨૧, જિ. ગાંધીનગર (ગુજરાત)',
  addressEng: 'Shree Kutch Kadva Patidar Bhavan, Borisana Road, Kalol - 382721, Dist. Gandhinagar (Gujarat)',
  phone: '+91 98251 44556 / 02769 224488',
  email: 'info@kalolkutchpatidar.org',
  familiesCount: '850+',
  villagesCount: '35+',
  establishedYear: '1981',
  historyGuj: `કચ્છની પાવન ધરામાંથી કર્મભૂમિ તરીકે કલોલ અને ગાંધીનગર પંથકમાં આવી વસેલા કચ્છ કડવા પાટીદાર પરિવારોએ પોતાની વિશિષ્ટ ઓળખ, સાહસિકતા અને સંસ્કારોને ઉજાગર કર્યા છે. ૧૯૮૧માં આદરણીય વડીલોના દૂરંદેશી પ્રયાસોથી 'શ્રી કલોલ કચ્છ કડવા પાટીદાર સમાજ' ની સ્થાપના કરવામાં આવી.

કલોલ, છત્રાલ, સાઈજ અને આસપાસના ઔદ્યોગિક તેમજ વેપારી ક્ષેત્રમાં પાટીદાર બંધુઓએ ઉદ્યોગ, એન્જિનિયરિંગ, વેપાર અને ખેતીમાં અપ્રતિમ સફળતા હાંસલ કરી છે. સમાજનું પોતાનું ભવ્ય 'કચ્છ કડવા પાટીદાર સમાજ ભવન' કલોલ ખાતે સામાજિક, શૈક્ષણિક અને ધાર્મિક પ્રવૃત્તિઓનું જીવંત કેન્દ્ર છે.`,
  historyEng: `Originating from the sacred soil of Kutch, the Kutch Kadva Patidar families settled in Kalol and Gandhinagar have built a proud legacy of entrepreneurship, integrity, and cultural harmony. In 1981, community elders laid the foundation of Shree Kalol Kutch Kadva Patidar Samaj.

Today, more than 850+ families from over 35 native Kutch villages are united under this trust, leading industries, commerce, higher education, and community welfare initiatives. Our modern Patidar Bhavan in Kalol stands as a symbol of unity and cultural pride.`,
  coreValues: [
    {
      titleGuj: 'મા ઉમિયાની ભક્તિ અને સંસ્કાર',
      titleEng: 'Devotion to Kuldevi Maa Umiya',
      descGuj: 'સનાતન હિન્દુ ધર્મ પરંપરા, દૈવી સંસ્કારો અને પરિવારના નૈતિક મૂલ્યોનું જતન.',
      descEng: 'Upholding righteous Hindu traditions, family morals, and divine heritage.',
    },
    {
      titleGuj: 'કચ્છથી કલોલ સુધીની સંગઠિત શક્તિ',
      titleEng: 'Kutch to Kalol Unity',
      descGuj: 'કચ્છના ૩૫+ ગામોના પરિવારો વચ્ચે ગાઢ પારસ્પરિક સ્નેહ, આદર અને ભાઈચારો.',
      descEng: 'Binding families from 35+ native Kutch villages in lifelong fraternity.',
    },
    {
      titleGuj: 'ઉચ્ચ શિક્ષણ અને યુવા કેળવણી',
      titleEng: 'Youth Education & Scholarships',
      descGuj: 'તેજસ્વી વિદ્યાર્થીઓને સ્કોલરશીપ, ગોલ્ડ મેડલ અને કારકિર્દી માર્ગદર્શન સહાય.',
      descEng: 'Awarding higher education scholarships, gold medals, and career mentorship.',
    },
    {
      titleGuj: 'પરસ્પર સામાજિક સહકાર & સેવા',
      titleEng: 'Social Harmony & Welfare',
      descGuj: 'લગ્ન પ્રસંગો, સુખ-દુઃખના પ્રસંગોમાં સાથ અને જરૂરિયાતમંદ પરિવારોને તબીબી ટેકો.',
      descEng: 'Standing shoulder-to-shoulder in celebratory and difficult times.',
    },
  ],
};

export const SAMAJ_PERSONS: SamajPerson[] = [];

export const EVENT_PHOTOS: EventPhoto[] = [];

export const CALENDAR_EVENTS: CalendarEvent[] = [];
