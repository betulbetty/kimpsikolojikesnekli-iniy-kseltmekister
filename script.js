// Temel DOM öğelerini seçme
const questionContainer = document.getElementById('question-container');
const answerButtons = document.querySelectorAll('.answer-btn'); // querySelectorAll ile tüm butonları seçiyoruz
const fiftyFiftyButton = document.getElementById('fifty-fifty');
const audiencePollButton = document.getElementById('audience-poll');
const phoneAFriendButton = document.getElementById('phone-a-friend');
const feedbackJokerButton = document.getElementById('feedback-joker');
const scoreDisplay = document.getElementById('score'); // Artık skor değil, kazanılan ödül ve rozet gösterilecek
const moneyLevelsContainer = document.querySelector('.money-levels'); // Para ağacı hala aynı isimde
const moneyLevels = document.querySelectorAll('.money-levels div'); // Seviye div'leri
const notificationBox = document.getElementById('notification-box');

// Oyun durumu değişkenleri
let currentQuestionIndex = 0;
let currentLevel = 0; // Başlangıç seviyesi 0 olarak ayarlandı, ilk doğru cevaptan sonra 1 olacak
let fiftyFiftyUsed = false;
let audiencePollUsed = false;
let phoneAFriendUsed = false;
let feedbackJokerUsed = false;

// Sorular (örnek sorular, gerçek sorularınızı buraya ekleyebilirsiniz)
// Her cevabın feedback özelliği 'Dönüt Al' jokeri için kullanılacak
const questions = [
    {
        question: "Çok yoğun bir gün geçirdin ve kafan bin bir düşünceyle dolup taştı. Bu durumda 'şimdiye odaklanmak' için ne yaparsın?",
        answers: [
            { text: "Tüm düşünceleri kafandan atmaya çalışırım.", correct: false, feedback: "Düşünceleri zorla atmaya çalışmak genelde işe yaramaz, hatta onları daha da güçlendirebilir. Önemli olan, düşüncelere takılıp kalmamak." },
            { text: "Gelecekte olabilecek kötü şeyleri düşünmeye devam ederim.", correct: false, feedback: "Gelecek kaygısı, şu anı yaşamana engel olur ve genellikle bir çözüm de getirmez." },
            { text: "Derin bir nefes alıp, vücudumdaki hislere dikkatimi veririm.", correct: true, feedback: "Derin nefes almak ve vücudunu dinlemek, zihnini sakinleştirir ve 'şimdiye odaklanma' becerini geliştirir. Bu, psikolojik esnekliğin temelidir." },
            { text: "Geçmişte olan olayları durmadan analiz ederim.", correct: false, feedback: "Geçmişe takılıp kalmak, şu an harekete geçmeni engeller." }
        ]
    },
    {
        question: "Bir hata yaptın ve içinden sürekli 'Ne kadar beceriksizim!' gibi sesler geliyor. Bu durumda kendine karşı 'şefkatli olmak' ne anlama gelir?",
        answers: [
            { text: "Kendini tamamen suçlar ve cezalandırırsın.", correct: false, feedback: "Kendine karşı çok acımasız olmak, motivasyonunu düşürür ve iyi hissetmeni engeller." },
            { text: "Hatayı yok sayar ve hiç olmamış gibi davranırsın.", correct: false, feedback: "Hataları görmezden gelmek, onlardan ders çıkarma fırsatını kaçırmana neden olabilir." },
            { text: "'İnsanlık hali, herkes hata yapar' diyerek kendine anlayış gösterirsin.", correct: true, feedback: "'İnsanlık hali, herkes hata yapar' demek, kendine karşı 'şefkatli olmanın' bir parçasıdır. Psikolojik esneklik, zor duygularla nazikçe başa çıkabilmeyi gerektirir." },
            { text: "Başkalarını yaptıkları hatalardan dolayı eleştirirsin.", correct: false, feedback: "Başkalarını eleştirmek, kendi hatalarından kaçmanın bir yolu olabilir." }
        ]
    },
    {
        question: "Ulaşmak istediğin büyük bir hedefin var ama önüne engeller çıktı. 'Değerlerine uygun hareket etmek' ilkesini en iyi anlatan davranış hangisidir?",
        answers: [
            { text: "Hedefi hemen bırakırsın çünkü çok zor görünüyor.", correct: false, feedback: "Değerlerine uygun hedeflerden vazgeçmek, sonradan pişmanlık getirebilir." },
            { text: "Engelleri hiç umursamayıp aynı şekilde ilerlemeye çalışırsın.", correct: false, feedback: "Engelleri görmezden gelmek gerçekçi değildir ve daha büyük sorunlara yol açabilir." },
            { text: "Hedefine ulaşmak için farklı yollar arar ve dener, kendi değerlerinden şaşmazsın.", correct: true, feedback: "'Değerlerine uygun hareket etmek', hedefine ulaşmada esnek olmayı ve kendi önemli bulduğun şeylere göre davranmayı içerir. Psikolojik esneklik, zorluklar karşısında yılmamayı gerektirir." },
            { text: "Suçu başkalarına atarsın.", correct: false, feedback: "Suçu başkalarına atmak, kendi sorumluluğundan kaçmaktır ve sorunu çözmez." }
        ]
    },
    {
        question: "Seni endişelendiren bir durumla karşılaştığında, 'kabullenme' becerisini göstermek ne anlama gelir?",
        answers: [
            { text: "Endişeyi tamamen yok etmeye çalışırsın.", correct: false, feedback: "Duyguları kontrol etmeye çalışmak genelde boşuna bir çabadır ve daha çok stres yaratır." },
            { text: "Endişeyi görmezden gelir, yokmuş gibi davranırsın.", correct: false, feedback: "Duyguları bastırmak veya görmezden gelmek, daha sonra daha güçlü bir şekilde ortaya çıkmalarına neden olabilir." },
            { text: "Endişenin olduğunu fark eder, onunla savaşmak yerine o anki duruma odaklanırsın.", correct: true, feedback: "'Kabullenme', zor duyguların varlığını inkar etmeden, onlarla savaşmak yerine o anki duruma odaklanabilmektir. Bu, psikolojik esnekliğin önemli bir yönüdür." },
            { text: "Endişenin geçmesini beklerken hiçbir şey yapmazsın.", correct: false, feedback: "Pasif kalmak, durumun düzelmesi için hiçbir şey yapmamak anlamına gelir." }
        ]
    },
    {
        question: "Gelecekle ilgili belirsizlikler seni düşündürüyor. Bu durumda 'esnek düşünme' becerisi sana nasıl yardımcı olabilir?",
        answers: [
            { text: "Sadece en kötü senaryoyu düşünerek hazırlanırsa.", correct: false, feedback: "En kötü senaryolara odaklanmak, gereksiz endişe yaratır ve çözüm bulmana engel olur." },
            { text: "Geleceği kesin olarak tahmin etmeye çalışırsın.", correct: false, feedback: "Geleceği tahmin etmek mümkün değildir ve bu çaba boş yere enerjini tüketir." },
            { text: "Farklı olasılıkları düşünür ve her duruma uyum sağlayabileceğine inanırsın.", correct: true, feedback: "'Esnek düşünme', katı ve tek tip düşünceler yerine farklı ihtimalleri değerlendirebilmeyi içerir. Psikolojik esneklik, belirsizlik karşısında uyum sağlayabilme yeteneğidir." },
            { text: "Hiçbir şey düşünmemeye çalışırsın.", correct: false, feedback: "Düşünmemeye çalışmak genellikle daha çok düşünmeye yol açar; önemli olan düşüncelerle olan ilişkini değiştirmektir." }
        ]
    },
    {
        question: "Moralini bozan bir şey hissettiğinde, bu duyguyla 'bağlantı kurma' ve onu anlamaya çalışma ne demektir?",
        answers: [
            { text: "Hemen dikkatini dağıtacak bir şeyle uğraşırsın.", correct: false, feedback: "Dikkat dağıtmak, duyguyu geçici olarak bastırsa da uzun vadede işe yaramaz." },
            { text: "Duyguyu bastırmaya çalışırsın.", correct: false, feedback: "Duyguları bastırmak, daha sonra kontrolsüz bir şekilde ortaya çıkmalarına neden olabilir." },
            { text: "Durup bu duygunun ne olduğunu, vücudunda nasıl hissettirdiğini fark edersin.", correct: true, feedback: "'Duyguyla bağlantı kurma', hissettiğin duyguları fark etmek, adlandırmak ve onlarla yargılamadan kalabilmektir. Bu, psikolojik esneklikğın önemli bir parçasıdır." },
            { text: "Duygudan tamamen kaçarsın.", correct: false, feedback: "Duygulardan kaçınmak, hem acıyı uzatır hem de önemli dersler almanı engeller." }
        ]
    },
    {
        question: "Başkalarının senden beklentileriyle kendi değerlerin çeliştiğinde, psikolojik olarak esnek biri nasıl davranır?",
        answers: [
            { text: "Kendi değerlerinden vazgeçerek herkesi mutlu etmeye çalışır.", correct: false, feedback: "Kendine sadık kalmamak, iç çatışmalara ve mutsuzluğa yol açar." },
            { text: "Başkalarının beklentilerini tamamen görmezden gelir.", correct: false, feedback: "Başkalarını tamamen yok saymak, ilişkilerini zedeleyebilir ve yalnız kalmana neden olabilir." },
            { text: "Kendi değerlerini açıkça söylerken, başkalarının fikirlerini de dinlemeye çalışır.", correct: true, feedback: "Psikolojik olarak esnek olmak, kendi değerlerinin farkında olmayı ve bunları başkalarıyla dengeli bir şekilde ifade edebilmeyi içerir." },
            { text: "Tartışmadan kaçınmak için sessiz kalır.", correct: false, feedback: "Sessiz kalmak, kendi ihtiyaçlarını ve değerlerini ifade etme fırsatını kaçırmana neden olur." }
        ]
    },
    {
        question: "Zor bir karar vermen gerektiğinde, 'farklı açılardan bakma' becerisi sana nasıl yardımcı olabilir?",
        answers: [
            { text: "Sadece kendi düşüncelerine odaklanırsın.", correct: false, feedback: "Tek bir bakış açısına takılıp kalmak, sınırlı çözümlere yol açar." },
            { text: "Kararı tamamen başkalarının vermesini beklersin.", correct: false, feedback: "Sorumluluğu başkalarına atmak, kişisel gelişimini engeller." },
            { text: "Durumu farklı yönlerden ve olası sonuçlarıyla birlikte değerlendirirsin.", correct: true, feedback: "'Farklı açılardan bakma', bir durumu farklı yönlerden görebilmeyi ve olası sonuçlarını değerlendirebilmeyi içerir. Bu, daha bilinçli ve esnek kararlar almaya yardımcı olur." },
            { text: "En hızlı görünen kararı verirsin.", correct: false, feedback: "Hızlı kararlar, genellikle düşünülmemiş sonuçlara yol açabilir. Esneklik, bilinçli seçimler yapmayı gerektirir." }
        ]
    },
    // Yeni Eklenen Sorular: Psikolojik esnekliği artırmaya yönelik senaryo bazlı sorular
    {
        question: "Önemli bir sunum öncesi çok heyecanlı ve gerginsin. Bu duygularla başa çıkmak için 'kabul etme ve mesafeli durma' becerilerini nasıl kullanırsın?",
        answers: [
            { text: "Heyecanımı tamamen yok saymaya çalışırım.", correct: false, feedback: "Duyguları yok saymak, onların etkisini azaltmak yerine artırabilir." },
            { text: "Kendime 'Bu heyecan doğal, bırak aksın ve benim bir parçam değil sadece bir duygu' derim.", correct: true, feedback: "Bu yaklaşım, duyguların varlığını kabul ederken, onlarla özdeşleşmemeyi (mesafeli durma) sağlar. Böylece duyguya takılıp kalmadan harekete geçebiliriz." },
            { text: "Sunumu iptal ederim çünkü çok gerginim.", correct: false, feedback: "Önemli gördüğün işlerden kaçınmak, uzun vadede pişmanlık yaratabilir." },
            { text: "Başka birinin sunumu yapmasını isterim.", correct: false, feedback: "Sorumluluktan kaçınmak, esneklik becerilerinin gelişimini engeller." }
        ]
    },
    {
        question: "Bir arkadaşın seni kırdığında ve içinde öfke hissettiğinde, 'değerlerine uygun iletişim' açısından en iyi yol hangisidir?",
        answers: [
            { text: "Öfkeni içinde tutar ve arkadaşınla bir daha konuşmazsın.", correct: false, feedback: "Duyguları bastırmak ve kaçınmak, ilişkileri zedeler." },
            { text: "Hemen arkadaşına bağırıp öfkeni dışarı vurursun.", correct: false, feedback: "Değerlerine uygun olmayan ani tepkiler, durumu daha da kötüleştirebilir." },
            { text: "Öfkeni fark eder, sakinleştikten sonra değerlerine (dürüstlük, anlayış gibi) uygun bir şekilde arkadaşınla konuşursun.", correct: true, feedback: "Duygunu fark edip (farkındalık), değerlerin doğrultusunda (değerlerine uygun hareket etme) ve yapıcı bir şekilde iletişim kurmak (esnek düşünme), psikolojik esnekliğin önemli göstergeleridir." },
            { text: "Arkadaşını tamamen hayatından çıkarırsın.", correct: false, feedback: "Ani ve köklü kararlar vermek yerine, durumu esnek bir şekilde değerlendirmek daha faydalıdır." }
        ]
    },
    {
        question: "Yeni bir hobiyi denemeye başladın ama ilk denemelerinde pek başarılı olamadın. Bu durum karşısında 'devam etme' becerini nasıl gösterirsin?",
        answers: [
            { text: "Hemen pes eder ve bu hobinin bana göre olmadığını düşünürüm.", correct: false, feedback: "Hemen pes etmek, potansiyel gelişim fırsatlarını kaçırmana neden olur." },
            { text: "Kendimi başarısız ilan eder ve bir daha denemem.", correct: false, feedback: "Kendine karşı acımasız olmak yerine şefkatli yaklaşmak daha yapıcıdır." },
            { text: "Başarısızlığı bir öğrenme fırsatı olarak görür, küçük adımlarla tekrar denemeye devam ederim.", correct: true, feedback: "Dirençli olmak ve zorluklar karşısında kararlılıkla devam etmek (devam etme), psikolojik esnekliğin temelidir. Her deneme bir öğrenme fırsatıdır." },
            { text: "Sadece çok iyi olduğum alanlara odaklanırım.", correct: false, feedback: "Gelişim alanlarından kaçınmak, esnekliğini sınırlar." }
        ]
    },
    {
        question: "Sosyal medyada gördüğün 'mükemmel' hayatlar seni kötü hissettiriyor. Bu durumla başa çıkmak için 'kendini bir bağlam olarak görme' becerisi nasıl yardımcı olabilir?",
        answers: [
            { text: "Sosyal medyadan tamamen uzaklaşırım ve insanlarla bağımı koparırım.", correct: false, feedback: "Tamamen kaçınmak yerine, sosyal medyayla sağlıklı bir ilişki kurmak daha sürdürülebilirdir." },
            { text: "Kendimi onlarla karşılaştırır ve kendi hayatımı eleştiririm.", correct: false, feedback: "Kendini başkalarıyla olumsuz karşılaştırmak, psikolojik sağlığını kötü etkiler." },
            { text: "Bu düşüncelerin sadece zihnimde olduğunu fark eder, onlarla savaşmak yerine içsel bir gözlemci gibi onları izler ve kendi değerlerin doğrultusunda hareket etmeye odaklanırım.", correct: true, feedback: "'Düşüncelerden ayrışma' ve 'kendini bir bağlam olarak görme', düşünceleri yargılamadan gözlemleyebilme ve kendini düşüncelerinle özdeşleştirmeme becerisidir. Bu, değerlerine uygun hareket etmek için sana alan yaratır." },
            { text: "Sosyal medyada daha fazla zaman geçirerek kendimi daha iyi hissetmeye çalışırım.", correct: false, feedback: "Kaçınma davranışları genellikle sorunu daha da derinleştirir." }
        ]
    },
    // Yeni Eklenen Sorular
    {
        question: "Okulda veya arkadaş ortamında **dışlanmış hissettiğinde**, bu duyguyla nasıl başa çıkarsın?",
        answers: [
            { text: "Hemen ortamı terk eder ve bir daha o kişilerin olduğu yere gitmem.", correct: false, feedback: "Dışlanma hissiyle başa çıkmak için kaçınmak, uzun vadede yalnızlığı artırabilir." },
            { text: "İçime kapanır, kimseyle konuşmam ve kendimi değersiz hissederim.", correct: false, feedback: "Pasif kalmak ve değersizlik hissi, durumu değiştirmek için harekete geçmeni engeller." },
            { text: "Duygumu fark eder, bu hissin geçici olduğunu kabul eder ve değerlerime uygun şekilde iletişimi sürdürmeye çalışırım.", correct: true, feedback: "'Kabullenme' ve 'değerlere bağlı hareket etme', dışlanma hissini fark edip ona teslim olmadan, değerlerin doğrultusunda sosyal bağlarını sürdürmeyi hedefler." },
            { text: "Dışlandığımı düşündüğüm kişileri ben de dışlarım veya onlara karşı tavır alırım.", correct: false, feedback: "Agresif veya kaçınmacı tepkiler, sosyal bağları daha da zedeleyebilir." }
        ]
    },
    {
        question: "Ailenle yaşadığın bir **tartışmada haksızlığa uğradığını düşündüğünde**, sakin kalıp durumu yönetmek için ne yaparsın?",
        answers: [
            { text: "Öfkemi kontrol edemeyip bağırarak tepki veririm.", correct: false, feedback: "Duyguların kontrolsüz ifadesi, iletişimi koparabilir ve sorunları derinleştirebilir." },
            { text: "Konuyu tamamen kapatır, bir daha açmam ve içimde yaşarım.", correct: false, feedback: "Duyguları bastırmak, zamanla birikerek daha büyük sorunlara yol açabilir." },
            { text: "Öfkemi ve hayal kırıklığımı fark eder, ancak sakinleşince ve doğru zamanı bulunca 'ben' dilini kullanarak duygularımı ifade ederim.", correct: true, feedback: "Duygusal esneklik, zorlayıcı duyguları kabul edip onlarla kalabilme ve bu duygulara rağmen değerlerine uygun (saygılı iletişim) eylemde bulunabilme kapasitesidir." },
            { text: "Suçu tamamen karşı tarafa atar ve kendimde hiç hata görmem.", correct: false, feedback: "Tek taraflı suçlama, empatiyi engeller ve çözüm odaklı değildir." }
        ]
    },
    {
        question: "Okulda bir projeden **beklenmedik şekilde düşük not aldığında**, bu durumla nasıl başa çıkarsın?",
        answers: [
            { text: "Kendimi tamamen yetersiz hisseder, bu dersteki yeteneğimi sorgular ve pes ederim.", correct: false, feedback: "Yetersizlik hissiyle pes etmek, gelişim fırsatlarını kaçırır ve özgüvenini düşürür." },
            { text: "Düşük notu yok sayar, hiçbir şey olmamış gibi davranırım.", correct: false, feedback: "Hatalardan ders çıkarmamak, tekrar aynı zorlukları yaşamana neden olabilir." },
            { text: "Hayal kırıklığımı kabul eder, ancak bu notun sadece bir deneyim olduğunu ve öğrenmek için bir fırsat olduğunu düşünerek eksiklerimi belirler ve tekrar denerim.", correct: true, feedback: "'Kabullenme' ve 'devam etme', başarısızlığı bir son olarak değil, bir öğrenme ve gelişim fırsatı olarak görmeyi sağlar. 'Esnek düşünme' ise alternatif yollar bulmana yardımcı olur." },
            { text: "Notumun kötü olması için başkalarını veya sistemi suçlarım.", correct: false, feedback: "Sorumluluğu başkalarına yüklemek, kişinin kendi gelişimini engeller." }
        ]
    },
    {
        question: "Kendini sürekli olarak **yetersiz veya değersiz hissettiğinde**, bu düşüncelerle nasıl bir yol izlersin?",
        answers: [
            { text: "Bu düşüncelerin doğru olduğuna inanır ve kendimi herkesten daha kötü görürüm.", correct: false, feedback: "Olumsuz düşüncelere tamamen inanmak, öz saygını zedeler ve harekete geçmeni zorlaştırır." },
            { text: "Bu düşünceleri kafamdan atmaya çalışır, olumlu düşünmeye zorlarım.", correct: false, feedback: "Düşünceleri zorla bastırmak veya değiştirmeye çalışmak, çoğu zaman işe yaramaz ve daha fazla iç çatışmaya yol açar." },
            { text: "Bu düşüncelerin sadece 'düşünce' olduğunu fark eder, onlarla savaşmak yerine içsel bir gözlemci gibi onları izler ve kendi değerlerin doğrultusunda hareket etmeye odaklanırım.", correct: true, feedback: "'Düşüncelerden ayrışma' ve 'kendini bir bağlam olarak görme', düşünceleri yargılamadan gözlemleyebilme ve kendini düşüncelerinle özdeşleştirmeme becerisidir. Bu, değerlerine uygun hareket etmek için sana alan yaratır." },
            { text: "Kendimi başkalarıyla kıyaslayarak daha iyi hissetmeye çalışırım.", correct: false, feedback: "Sürekli kıyaslama, çoğu zaman yetersizlik hissini pekiştirir ve mutluluğu engeller." }
        ]
    },
    {
        question: "Sosyal medyada veya çevrende gördüğün 'mükemmel' dış görünüş algısıyla başa çıkmak için hangi yaklaşım psikolojik esnekliğini artırır?",
        answers: [
            { text: "Kendi dış görünüşümü sürekli eleştirir ve değişmeye çalışırım.", correct: false, feedback: "Mükemmeliyetçi dış görünüş algısına kapılmak, kendine şefkati azaltır ve tatminsizliğe yol açar." },
            { text: "Bu tür paylaşımları tamamen görmezden gelir, kendimi her türlü sosyal medya etkileşiminden soyutlarım.", correct: false, feedback: "Kaçınma, dış dünyayla sağlıklı bir ilişki kurmayı engelleyebilir." },
            { text: "Bu algıların toplumsal bir şey olduğunu fark eder, kendi bedenimi ve kendimi olduğu gibi kabul eder, sağlıklı yaşam alışkanlıklarıma odaklanırım.", correct: true, feedback: "'Düşüncelerden ayrışma' (düşüncelerin sadece düşünce olduğunu fark etme) ve 'kabullenme' (kendini olduğu gibi kabul etme), dış görünüş baskısıyla başa çıkmada temel becerilerdir. 'Değerlerine uygun hareket etme' ise sağlığa odaklanmayı içerir." },
            { text: "Mükemmel görünen kişileri takip etmeyi bırakır ve onlara karşı kötü duygular beslerim.", correct: false, feedback: "Başkalarına karşı olumsuz duygular beslemek, kendi iç huzurunu bozar." }
        ]
    }
];

// Ödüller ve Rozetler (Para Ağacındaki data-amount'lara karşılık gelecek şekilde)
const awards = {
    1: { name: "Esneklik Tohumu", description: "Psikolojik esnekliğin temellerini attın!", badge: "🌱" },
    2: { name: "Farkındalık Fidanı", description: "Şimdiki ana odaklanma becerini geliştiriyorsun.", badge: "🌿" },
    3: { name: "Değer Pusulası", description: "Değerlerine bağlı kalma yolunda emin adımlarla ilerliyorsun.", badge: "🧭" },
    4: { name: "Kabul Çiçeği", description: "Zorlu duyguları kabul etme becerini sergiledin.", badge: "🌸" },
    5: { name: "Esnek Düşünce Filizi", description: "Düşüncelerine daha esnek yaklaşabiliyorsun.", badge: "🧠" },
    6: { name: "Duygu Temasçısı", description: "Duygularınla temasa geçme becerini geliştirdin.", badge: "🤝" },
    7: { name: "Şefkatli Kalp", description: "Kendine şefkat göstermede ustalaşıyorsun.", badge: "💖" },
    8: { name: "Perspektif Ustası", description: "Farklı bakış açıları kazanabiliyorsun.", badge: "🔭" },
    9: { name: "Uyumlu Yaşam Ağacı", description: "Hayatın zorluklarına uyum sağlama becerilerin güçleniyor.", badge: "🌳" },
    10: { name: "Dirençli Kaya", description: "Zorluklar karşısında daha dirençli hale geldin.", badge: "🪨" },
    11: { name: "Bilinçli Eylem Elçisi", description: "Değerlerine uygun bilinçli eylemler sergiliyorsun.", badge: "🌟" },
    12: { name: "Psikolojik Esneklik Bilgesi", description: "Tebrikler! Psikolojik Esneklik Yarışması'nın zirvesine ulaştın ve gerçek bir bilge oldun!", badge: "🎓" },
    13: { name: "Sosyal Bağ Kurucu", description: "Dışlanma hissiyle başa çıkarak sosyal bağlarını güçlendirdin!", badge: "🫂" },
    14: { name: "Empati Köprüsü", description: "İletişim becerilerinle aile içi sorunlara çözüm buldun!", badge: "🌉" },
    15: { name: "Öğrenme Kahramanı", description: "Akademik başarısızlığı bir öğrenme fırsatına çevirdin!", badge: "📚" },
    16: { name: "Öz Değer Keşfeden", description: "Yetersizlik hislerine rağmen kendi değerini buldun!", badge: "💎" },
    17: { name: "Bedenim Benim Tapınağım", description: "Mükemmeliyetçi dış görünüş algısının ötesine geçtin!", badge: "🧘‍♀️" }
};

// Diziyi karıştırma fonksiyonu (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Oyunun başlangıç durumu
function startGame() {
    currentQuestionIndex = 0;
    currentLevel = 0; // Başlangıç seviyesi 0 olarak ayarlandı
    fiftyFiftyUsed = false;
    audiencePollUsed = false;
    phoneAFriendUsed = false;
    feedbackJokerUsed = false;

    // Joker butonlarını etkinleştir
    fiftyFiftyButton.disabled = false;
    audiencePollButton.disabled = false;
    phoneAFriendButton.disabled = false;
    feedbackJokerButton.disabled = false;
    
    // Bildirim kutusunu gizle
    notificationBox.classList.remove('show', 'correct-feedback', 'joker-feedback', 'game-over-feedback');

    // Skor ekranını başlangıçta gizle
    scoreDisplay.style.visibility = 'hidden'; 
    scoreDisplay.innerHTML = ""; // İçeriği de boşalt

    // Oyun bittiğinde arka plan rengini sıfırla (eğer değişmişse)
    document.body.style.backgroundColor = ''; 

    shuffleArray(questions); // Her oyun başlangıcında soruları karıştır
    updateMoneyLevels(); // Para ağacını (ödül ağacını) güncelle
    showQuestion(); // İlk soruyu göster
    showNotification('Oyun Başladı! Psikolojik esneklik yolculuğuna hoş geldin!', 'normal');
}

// Soruyu ekranda gösterme
function showQuestion() {
    resetAnswerButtons(); // Önceki cevap butonlarını sıfırla
    const currentQ = questions[currentQuestionIndex];
    questionContainer.innerText = `Soru ${currentQuestionIndex + 1}: ${currentQ.question}`;

    const shuffledAnswers = [...currentQ.answers]; // Cevapları karıştırmak için kopyasını al
    shuffleArray(shuffledAnswers); // Cevap şıklarını da karıştır

    shuffledAnswers.forEach((answer, index) => {
        const button = answerButtons[index];
        button.innerText = `${String.fromCharCode(65 + index)}: ${answer.text}`;
        button.dataset.correct = answer.correct; // Cevabın doğru olup olmadığını kaydet
        button.dataset.feedback = answer.feedback; // Geri bildirim metnini kaydet
        button.style.visibility = 'visible'; // Gizlenmiş butonları tekrar göster
        button.classList.remove('correct', 'wrong'); // Önceki durumları temizle
        button.disabled = false; // Butonları tekrar etkinleştir
    });
}

// Cevap butonlarını sıfırlama (stil ve aktivasyon)
function resetAnswerButtons() {
    answerButtons.forEach(button => {
        button.classList.remove('correct', 'wrong');
        button.disabled = false;
        button.style.visibility = 'visible'; // Gizlenmişleri göster (50/50 sonrası için)
    });
}

// Bildirim gösterme
function showNotification(message, type = 'normal') {
    notificationBox.innerText = message;
    notificationBox.className = 'notification show'; // 'show' sınıfını ekle
    if (type === 'correct') {
        notificationBox.classList.add('correct-feedback');
    } else if (type === 'joker') {
        notificationBox.classList.add('joker-feedback');
    } else if (type === 'game-over') {
        notificationBox.classList.add('game-over-feedback');
    }
    // Normal ve joker bildirimleri için otomatik gizleme
    // Süre 3 saniyeden 5 saniyeye çıkarıldı
    if (type === 'normal' || type === 'joker' || type === 'correct') {
        setTimeout(() => {
            notificationBox.classList.remove('show');
            notificationBox.classList.remove('correct-feedback');
            notificationBox.classList.remove('joker-feedback');
        }, 5000); // 5 saniye sonra kaybol
    }
}

// Cevap seçildiğinde
function selectAnswer(e) {
    const selectedButton = e.target;
    const isCorrect = selectedButton.dataset.correct === 'true';

    // Tüm cevap butonlarını devre dışı bırak
    answerButtons.forEach(button => {
        button.disabled = true;
    });

    if (isCorrect) {
        selectedButton.classList.add('correct');
        showNotification('Doğru cevap! 🎉', 'correct');

        currentQuestionIndex++;
        currentLevel++; // Bir sonraki ödüle geç

        // İlk doğru cevaptan sonra skor ekranını göster
        if (currentLevel === 1) {
            scoreDisplay.style.visibility = 'visible';
        }

        // Para ağacındaki mevcut seviyeyi işaretle
        const currentLevelDiv = moneyLevelsContainer.querySelector(`[data-level="${currentLevel}"]`);
        if (currentLevelDiv) {
            currentLevelDiv.classList.add('correct-answer-animation'); // Animasyon sınıfı ekle
        }

        setTimeout(() => {
            if (currentLevelDiv) {
                currentLevelDiv.classList.remove('correct-answer-animation'); // Animasyon sınıfını kaldır
            }

            if (currentQuestionIndex < questions.length && currentLevel <= Object.keys(awards).length) {
                updateMoneyLevels(); // Para ağacını (ödül ağacını) güncelle
                updateScoreDisplay(); // Yeni ödülü göster
                setTimeout(showQuestion, 1000); // 1 saniye sonra yeni soruyu göster
            } else {
                endQuiz(true); // Tüm sorular bitti veya tüm ödüller kazanıldı
            }
        }, 1500); // 1.5 saniye sonra geçiş
    } else {
        selectedButton.classList.add('wrong');
        // Doğru cevabı göster
        answerButtons.forEach(button => {
            if (button.dataset.correct === 'true') {
                button.classList.add('correct');
            }
        });
        showNotification('Yanlış cevap! 😟', 'game-over');
        setTimeout(() => {
            endQuiz(false); // Oyunu kaybetme durumu
        }, 2000); // 2 saniye sonra bitir
    }
}

// Ödül ağacını güncelleme (aktif seviye ve garanti seviyeleri)
function updateMoneyLevels() {
    moneyLevels.forEach(levelDiv => {
        levelDiv.classList.remove('active', 'guaranteed-reached');
    });

    // Mevcut aktif seviyeyi işaretle (eğer seviye 0 değilse)
    if (currentLevel > 0) {
        const activeLevelDiv = moneyLevelsContainer.querySelector(`[data-level="${currentLevel}"]`);
        if (activeLevelDiv) {
            activeLevelDiv.classList.add('active');
        }
    }

    // Garanti altına alınan seviyeleri işaretle
    moneyLevels.forEach(levelDiv => {
        if (levelDiv.classList.contains('guaranteed') && parseInt(levelDiv.dataset.level) <= currentLevel) {
            levelDiv.classList.add('guaranteed-reached');
        }
    });
}

// Skor ekranını güncelleme (Artık ödülü ve rozeti gösterecek)
function updateScoreDisplay() {
    let currentAwardName = "";
    let currentBadge = "";

    // Eğer currentLevel 0 ise (oyun başında), ödül gösterme
    if (currentLevel === 0) {
        scoreDisplay.innerHTML = ""; // İçeriği boş bırak
        scoreDisplay.style.visibility = 'hidden'; // Gizle
        return;
    }

    // Kazanılan ödülü belirle
    let displayLevel = currentLevel > Object.keys(awards).length ? Object.keys(awards).length : currentLevel;
    
    if (awards[displayLevel]) {
        currentAwardName = awards[displayLevel].name;
        currentBadge = awards[displayLevel].badge;
    }

    // Eğer currentAwardName boşsa, "Kazanılan: " yazısını gösterme
    if (currentAwardName) {
        scoreDisplay.innerHTML = `Kazanılan: <br> ${currentAwardName} ${currentBadge}`;
        scoreDisplay.style.visibility = 'visible'; // Göster
    } else {
        scoreDisplay.innerHTML = "";
        scoreDisplay.style.visibility = 'hidden';
    }
}


// 50/50 Joker fonksiyonu
function useFiftyFiftyJoker() {
    if (fiftyFiftyUsed) return; // Joker zaten kullanıldıysa çık
    fiftyFiftyUsed = true;
    fiftyFiftyButton.disabled = true; // Jokeri devre dışı bırak

    const currentQ = questions[currentQuestionIndex];
    const correctAnsIndex = currentQ.answers.findIndex(answer => answer.correct);
    let incorrectIndices = [];
    currentQ.answers.forEach((answer, index) => {
        if (!answer.correct) {
            incorrectIndices.push(index);
        }
    });

    // İki yanlış cevabı rastgele seç ve gizle
    let removedCount = 0;
    // Gösterilen cevap butonlarını (karıştırılmış sıradakileri) hedef alıyoruz
    let currentlyVisibleButtons = Array.from(answerButtons).filter(btn => btn.style.visibility !== 'hidden');

    // Hangi cevapların yanlış olduğunu ve şu anda görünür olduğunu bul
    const visibleIncorrectButtons = currentlyVisibleButtons.filter(button => button.dataset.correct === 'false');

    while (removedCount < 2 && visibleIncorrectButtons.length > 0) {
        const randomIndex = Math.floor(Math.random() * visibleIncorrectButtons.length);
        const buttonToHide = visibleIncorrectButtons[randomIndex];
        
        buttonToHide.style.visibility = 'hidden';
        removedCount++;
        visibleIncorrectButtons.splice(randomIndex, 1); // Seçileni listeden çıkar
    }
    showNotification("50/50 jokeri kullanıldı! İki yanlış cevap kaldırıldı.", 'joker');
}

// Seyirci Jokeri fonksiyonu
function useAudiencePollJoker() {
    if (audiencePollUsed) return;
    audiencePollUsed = true;
    audiencePollButton.disabled = true;

    const currentQ = questions[currentQuestionIndex];
    const correctIndex = currentQ.answers.findIndex(answer => answer.correct);
    const pollResults = Array(currentQ.answers.length).fill(0);

    let correctPercentage = Math.floor(Math.random() * (70 - 40 + 1)) + 40; // %40-70 doğru
    pollResults[correctIndex] = correctPercentage;
    let remainingPercentage = 100 - correctPercentage;

    const incorrectIndices = currentQ.answers
        .map((_, i) => i)
        .filter(i => i !== correctIndex);

    // Kalan yüzdeleri yanlış cevaplara dağıt
    while (remainingPercentage > 0 && incorrectIndices.length > 0) {
        const indexToDistribute = Math.floor(Math.random() * incorrectIndices.length);
        const answerIndex = incorrectIndices[indexToDistribute];

        // Rastgele bir miktar ata, kalan miktardan fazla olmasın
        let share = Math.min(remainingPercentage, Math.floor(Math.random() * (remainingPercentage / incorrectIndices.length * 2)) + 1);
        
        pollResults[answerIndex] += share;
        remainingPercentage -= share;
        
        // Küçük kalanlar için yuvarlama veya sonuncuya ekleme
        if (remainingPercentage < 1 && remainingPercentage > 0) {
            pollResults[answerIndex] += remainingPercentage;
            remainingPercentage = 0;
        }

        incorrectIndices.splice(indexToDistribute, 1);
    }

    // Son bir kontrol: eğer toplam 100 değilse, farkı rastgele bir cevaba ekle/çıkar
    let currentTotal = pollResults.reduce((sum, val) => sum + val, 0);
    if (currentTotal !== 100) {
        const diff = 100 - currentTotal;
        const randomAnswerIndex = Math.floor(Math.random() * pollResults.length);
        pollResults[randomAnswerIndex] += diff;
    }

    let pollResultText = 'Seyirci Tahminleri:\n';
    currentQ.answers.forEach((answer, index) => {
        const displayedButtonText = answerButtons[index].charAt(0).toUpperCase(); // Cevap butonunun harfini al
        pollResultText += `${displayedButtonText}: %${pollResults[index]}\n`;
    });
    showNotification(pollResultText, 'joker');
}

// Telefon Jokeri fonksiyonu
function usePhoneAFriendJoker() {
    if (phoneAFriendUsed) return;
    phoneAFriendUsed = true;
    phoneAFriendButton.disabled = true;

    const currentQ = questions[currentQuestionIndex];
    const correctAns = currentQ.answers.find(answer => answer.correct);
    
    // Doğru cevabın ekrandaki (karıştırılmış) harfini bul
    let correctButtonLetter = '';
    for(let i = 0; i < answerButtons.length; i++) {
        if (answerButtons[i].dataset.correct === 'true') {
            correctButtonLetter = answerButtons[i].innerText.charAt(0);
            break;
        }
    }

    const advice = `Arkadaşın diyor ki: "Bence doğru cevap ${correctButtonLetter}. Çünkü: ${correctAns.feedback}"`;
    showNotification(advice, 'joker');
}

// Dönüt Al Jokeri fonksiyonu
function useFeedbackJoker() {
    if (feedbackJokerUsed) return;
    feedbackJokerUsed = true;
    feedbackJokerButton.disabled = true;

    const currentQ = questions[currentQuestionIndex];
    const correctAns = currentQ.answers.find(answer => answer.correct);
    if (correctAns && correctAns.feedback) {
        // Doğru cevabın metnini ve geri bildirimini göster
        showNotification(`Doğru Cevap: ${correctAns.text}\n\n${correctAns.feedback}`, 'joker'); 
    } else {
        showNotification('Bu soru için özel bir dönüt bulunmamaktadır.', 'joker');
    }
}

// Oyunu bitirme
function endQuiz(hasWon) {
    let finalMessage = "";
    let finalAwardName = "";
    let finalBadge = "";

    // Bildirim kutusunu temizle ve göster
    notificationBox.classList.remove('show', 'correct-feedback', 'joker-feedback');
    notificationBox.classList.add('show', 'game-over-feedback');

    // Oyun bittiğinde arka plan rengini mor yap
    document.body.style.backgroundColor = '#800080'; // Mor rengin hex kodu

    // Skor ekranını her zaman görünür yap (Oyun bittiğinde)
    scoreDisplay.style.visibility = 'visible';

    if (hasWon) {
        finalAwardName = awards[Object.keys(awards).length].name; // Son ödülü al
        finalBadge = awards[Object.keys(awards).length].badge; // Son rozeti al
        finalMessage = `OYUN BİTTİ!\nTebrikler! Tüm soruları doğru bildin! 🎉\nSen bir ${finalAwardName} ${finalBadge} oldun!`;
    } else {
        // Garantilenen seviyeyi bul
        let guaranteedAward = { name: "Hiçbir Şey", badge: "" };
        const allMoneyLevels = Array.from(document.querySelectorAll('.money-levels div'));
        
        let highestGuaranteedLevelReached = 0;

        // currentLevel'in bir eksiği olan seviyeye kadar olan garanti seviyelerini kontrol etmeliyiz,
        // çünkü yanlış cevap verildiğinde currentLevel zaten bir artmış oluyor.
        for (let i = currentLevel - 1; i >= 0; i--) { 
            const levelDiv = allMoneyLevels.find(div => parseInt(div.dataset.level) === i);
            if (levelDiv && levelDiv.classList.contains('guaranteed')) {
                highestGuaranteedLevelReached = i;
                break;
            }
        }

        if (highestGuaranteedLevelReached > 0 && awards[highestGuaranteedLevelReached]) {
            guaranteedAward = awards[highestGuaranteedLevelReached];
        } else if (currentLevel <= 1 && !hasWon) { // İlk soruda veya henüz ilk seviyede yanlış yaparsa
             guaranteedAward = { name: "Hiçbir Ödül", badge: "😔" };
        }
        
        finalAwardName = guaranteedAward.name;
        finalBadge = guaranteedAward.badge;
        finalMessage = `OYUN BİTTİ!\nMaalesef yanlış cevap verdin. 😟\nKazanılan: ${finalAwardName} ${finalBadge}`;
    }

    showNotification(finalMessage, 'game-over');
    questionContainer.innerText = finalMessage;
    answerButtons.forEach(button => button.style.display = 'none'); // Cevap butonlarını gizle

    // Yeniden başlama seçeneği sun
    setTimeout(() => {
        if (confirm('Yeniden oynamak ister misin?')) {
            startGame();
            answerButtons.forEach(button => button.style.display = ''); // Butonları tekrar göster
        } else {
            // İstersen burada ana sayfaya yönlendirme yapabilirsin
            // window.location.href = 'https://betul1526.github.io/sohbetarkadas-n-z/';
            questionContainer.innerText = "Oyun bitti. Yeniden başlamak için sayfayı yenileyin veya 'Yeniden Oyna' butonuna tıklayın.";
        }
    }, 4000); // 4 saniye sonra sor
}

// Olay dinleyicilerini ata (sadece bir kez)
answerButtons.forEach(button => {
    button.addEventListener('click', selectAnswer);
});
fiftyFiftyButton.addEventListener('click', useFiftyFiftyJoker);
audiencePollButton.addEventListener('click', useAudiencePollJoker);
phoneAFriendButton.addEventListener('click', usePhoneAFriendJoker);
feedbackJokerButton.addEventListener('click', useFeedbackJoker);

// Sayfa yüklendiğinde oyunu başlat
startGame();