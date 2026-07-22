// frontend/src/data/articles.en.js
// 📚 ARTICLE LIBRARY — English overlay for articles.js.
// Keyed by article id. Each entry: { title, excerpt, paragraphs[] }.
// paragraphs preserve the exact index structure of the Turkish source:
// plain strings stay strings; { quote, source } cards stay cards.
// Arabic/reference names in `source` are kept; Turkish glosses translated.

export const SHELVES_EN = {
  ahlak: 'Islamic Morals',
  ibadet: 'Our Life of Worship',
  siyer: 'Scenes from the Sīra',
  kalp: 'Heart & Spirituality',
};

const ARTICLES_EN = {
  // ─────────── ISLAMIC MORALS ───────────
  ofke: {
    title: 'Mastering Anger: The Real Strength',
    excerpt: 'Who is stronger — the one who pins his rival in wrestling, or the one who restrains himself in a moment of rage?',
    paragraphs: [
      'One day the Prophet (peace be upon him) asked those around him, "Whom do you consider a champion?" They said, "The one no one can defeat." He then taught that the true champion is the one who masters himself in a moment of anger (Bukhārī, Adab 76). This measure completely redefines strength: muscle overcomes a rival; willpower overcomes one\'s own soul.',
      { quote: 'They spend in prosperity and adversity, they restrain their anger and pardon people. And Allah loves those who do good.', source: 'Āl ʿImrān 134 (meaning)' },
      "The Qur'an does not ignore anger — it teaches us to govern it. Anger is part of human nature; the test lies in what we do when it comes. In Sūrat Fuṣṣilat we are commanded to repel evil with what is best; when this is done, the enmity between two people can be turned into a warm friendship (Fuṣṣilat 34).",
      "The Prophet also taught practical steps to the angry person: if you are standing, sit down; seek refuge in Allah from Satan; if possible, change your setting. These are techniques mentioned in the traditions whose physiology science confirms today: placing distance and time in between wins back those critical seconds between reaction and impulse.",
      "Swallowing anger is not weakness; on the contrary, it holds two victories at once. The first is won over the self, the second over the relationship: we all know from experience how a single sentence spoken in anger can destroy, and how a single moment held in patient silence can protect. A small step you can try today: when anger rises, say to yourself 'this is where real strength shows' and wait ten seconds.",
    ],
  },
  giybet: {
    title: 'Backbiting: The Tongue\'s Most Cunning Test',
    excerpt: 'Even if what we say is true, why is talking behind someone\'s back so grave?',
    paragraphs: [
      "One day the Prophet (peace be upon him) asked his Companions, 'Do you know what backbiting is?' and described it thus: 'It is to mention your brother with something he would dislike.' When someone asked, 'What if what I say is really in him?' the answer was clear: 'If what you say is in him, you have backbitten him; if it is not, you have slandered him' (Muslim, Birr 70).",
      { quote: 'Do not spy on one another, and do not backbite one another. Would any of you like to eat the flesh of his dead brother? You would loathe it!', source: 'Ḥujurāt 12 (meaning)' },
      "This comparison in the Qur'an is jolting because it lays bare the nature of backbiting: the one spoken about behind his back cannot defend himself — just like a dead person. Every piece torn from his honor is a bite that can never be put back.",
      'The hardest thing about backbiting is its cunning: it usually arrives dressed as "sharing our troubles," "assessing the situation," even "I\'m only telling you so we can pray for them." The measure is this: if that person were present with us, would we phrase this sentence in this tone? If not, our heart has already given the answer.',
      "The path of protection runs both ways. For our own tongue: when the topic starts turning against someone, change the subject or mention a good side of them. Against another's tongue: defend the brother who is not present. The traditions report that Allah keeps the Fire away from whoever defends his brother's honor. The tongue is a small organ; yet on the scale, the heaviest weights are most often won or lost with it.",
    ],
  },
  tevazu: {
    title: 'Humility: The Fuller the Wheat, the Lower It Bows',
    excerpt: 'Humility is not making yourself small — it is placing yourself in the right spot.',
    paragraphs: [
      "The Prophet (peace be upon him) taught that whoever humbles himself for the sake of Allah, Allah will raise him (Muslim, Birr 69). This is a divine equation that seems contrary to how the world works: while people push one another to reach the summit, the rising Islam proposes runs through bowing down — just like a full ear of wheat that bends over.",
      { quote: "Do not turn your face away from people in contempt, and do not walk arrogantly upon the earth. Indeed, Allah does not love the self-conceited boaster. Be moderate in your walk and lower your voice.", source: 'Luqmān 18-19 (meaning)' },
      "Luqmān's counsel to his son sketches humility in daily life: facial expression, gait, tone of voice. Arrogance usually hides not in grand words but in small gestures — in a curled lip, in an 'I already knew that.'",
      "When Sūrat al-Furqān describes 'the servants of the Most Merciful,' it ties their first trait to how they walk: they walk upon the earth with dignity and humility, and when the ignorant provoke them, they say 'peace' and pass on (Furqān 63). Humility is not passivity; it is being so full that you will not stoop to a needless quarrel.",
      "Humility must not be misunderstood: it is not seeing yourself as worthless, but knowing the source of your worth rightly. Knowledge, wealth, beauty — all are a trust. Whoever boasts of a trust has struck a pose with something that is not his own. Though the Prophet was the best of people, he mended his own sandals, helped with housework, and greeted children. This bowing at the summit is the very definition of humility.",
    ],
  },
  // ─────────── OUR LIFE OF WORSHIP ───────────
  namaz: {
    title: 'The Prayer: Five Meetings a Day',
    excerpt: 'Is the prayer the paying off of a debt, or an invitation renewed five times a day?',
    paragraphs: [
      "Those who see the prayer merely as an item on a to-do list miss its greatest gift. Made obligatory on the night of the Miʿrāj, the prayer literally means 'supplication, turning toward': five times a day, whatever the rush of life, sheltered slices of time set aside to be alone with our Lord.",
      { quote: 'Indeed, prayer restrains from immorality and wrongdoing.', source: 'ʿAnkabūt 45 (meaning)' },
      "This verse describes the transforming power of prayer. The choices of a person who lives five times a day with the awareness 'I will stand before Allah' change: a tongue that will enter the noon prayer in a state of purity does not want to be tainted by falsehood since morning. The prayer is five calibration points placed within the day; at every drift the compass turns back to the qibla.",
      "The Prophet (peace be upon him) likened the prayer to a river flowing past one's door: would any dirt remain on someone who bathes in it five times a day? (Bukhārī, Mawāqīt 6). The likeness speaks not only of sins being washed off but of renewal — the prayer is the name of rest, not exhaustion. Indeed the Prophet spoke words meaning 'the prayer refreshes me; the delight of my eye is in the prayer.'",
      "Small steps to capture khushūʿ (presence of heart): before entering the prayer, pause for the length of one breath; remember whose presence you are entering. Glance once at the meaning of the chapters you recite; a tongue that knows what it says awakens the heart too. And do not hurry — prostration is the moment the servant is nearest to his Lord; one does not rise quickly from there.",
    ],
  },
  dua: {
    title: 'Supplication: The Essence of Servitude',
    excerpt: 'Is asking a weakness? The secret in supplication where strength meets helplessness.',
    paragraphs: [
      "The Prophet (peace be upon him) called supplication 'the essence of worship' (Tirmidhī, Daʿawāt 1). For supplication is the purest form of servitude: when a person supplicates, he needs no intermediary, no appointment, no special place. Everyone who raises his two hands is, in that moment, speaking with the Lord of the universe.",
      { quote: 'When My servants ask you about Me, let them know that I am very near. I respond to the call of the caller when he calls upon Me.', source: 'Baqara 186 (meaning)' },
      "The subtlety of this verse is often missed: while the Qur'an answers other questions with 'Say...', here not even a messenger is placed in between — 'I am very near' is declared. There is no veil between the one who supplicates and his Lord.",
      "To those who say 'I supplicate but nothing happens,' the horizon the Prophet taught is this: no sincere supplication goes to waste. Either what is asked is given, or an evil is repelled, or it is stored as provision for the Hereafter. The acceptance of supplication is sometimes 'yes,' sometimes 'something better,' sometimes 'not yet.' The call in Sūrat Ghāfir is decisive: 'Call upon Me; I will respond to you' (Ghāfir 60).",
      "The manners of supplication deepen it: beginning with praise and blessings upon the Prophet, asking for both this world and the next, opening one's hands not only in hardship but in ease too. And most important: doing your own part for the thing you supplicate for. For supplication is the prayer of effort, not of laziness — the farmer first sows the seed, then asks for rain.",
    ],
  },
  oruc: {
    title: 'Fasting: Is It Only Going Hungry?',
    excerpt: 'Being able to have the tongue, the eye, and the heart fast — not just the stomach.',
    paragraphs: [
      "When fasting is mentioned, hunger comes to mind first; yet the Qur'an sets the goal of fasting with an entirely different word: taqwā. 'O you who believe! Fasting has been prescribed for you as it was prescribed for those before you, so that you may attain God-consciousness' (Baqara 183). Hunger is the means; the goal is a heart that lives with awareness of Allah.",
      { quote: 'Whoever does not abandon false speech and acting upon it, Allah has no need of his abandoning his food and drink.', source: 'Bukhārī, Ṣawm 8' },
      "This hadith widens the boundaries of fasting from the stomach to all the organs. If the tongue is not fasting from lies and backbiting; if the eye does not avoid the forbidden and the hand does not avoid injustice — then even if the stomach stays empty, the spirit of the fast has not been fed. The scrupulousness the Companions showed in fasting was exactly this: they counted staying away from sin, not hunger, as worship.",
      "The first lesson fasting teaches is empathy: the full person knows hunger only from a book; the fasting person learns it by living it. The second lesson is freedom: in fasting a person discovers that he is not the slave of the sentence 'I felt like it,' that he can say 'no' to his desires. The third is gratitude: the value of a single glass of water at the iftar table is fully known only by the one who thirsted for it until evening.",
      "It is possible to keep this school open outside Ramadan too: Monday and Thursday fasts and the ayyām al-bīḍ (the 13th-14th-15th of the lunar months) are encouraged in the traditions. But perhaps the most lasting is this: not to break the fast of the tongue once the fast has ended.",
    ],
  },
  // ─────────── SCENES FROM THE SĪRA ───────────
  elemin: {
    title: 'Al-Amīn: The Building of Trust',
    excerpt: 'The title earned before prophethood: the most trustworthy person in Mecca.',
    paragraphs: [
      "When revelation came to the Prophet, the Meccans were no strangers to him: for forty years he had lived among them, they knew his trade, they entrusted him with their deposits. So much so that the city called him not by his own name but 'al-Amīn' — the trustworthy. Such a title is not earned overnight; it is the seal of forty years of consistency.",
      "In his youth, while the Kaʿba was being repaired, the tribes nearly went to war over the honor of setting the Black Stone in its place. It was agreed that 'the first to enter through the gate' would arbitrate — and when Muhammad al-Amīn walked in, everyone was relieved. His solution too was worthy of his title: he placed the stone on a cloth, had a chief of each tribe take a corner, and shared the honor among all. Trustworthiness, joined with intelligence, turned a quarrel into peace.",
      { quote: 'Indeed, in the Messenger of Allah you have a beautiful example.', source: 'Aḥzāb 21 (meaning)' },
      "On the night of the Hijra the most striking photograph of this trust was taken: the Prophet, whose life was being plotted against, was — even as he left the city — keeping the Meccans' deposits under his pillow; even those who were his enemies were still entrusting their valuables to him. One reason he left ʿAlī behind was to return those deposits to their owners. The man to whom even his enemy entrusted his money: that is the definition of 'al-Amīn.'",
      "Today's lesson is clear: the first sentence of the message is built not with words but with character. People look at what we are before what we say. Keeping your word, doing your work soundly, being scrupulous with a trust — these are not 'small' virtues but a forty-year invitation itself.",
    ],
  },
  muahat: {
    title: 'The Covenant of Brotherhood: Muʾākhāt',
    excerpt: 'What did the Medinan say to the emigrant who left behind his home, his work, everything?',
    paragraphs: [
      "The Hijra is more than a migration story: the Meccan Muslims left behind their wealth, homes, and orchards and took refuge in Medina. The Prophet's solution was of a kind rarely seen in history: he declared each emigrant (muhājir) a brother to a Medinan (anṣārī). Not on paper — brotherhood at the table, in work, in inheritance.",
      { quote: 'Those who settled in the land and adopted the faith before them love those who emigrated to them. Even if they themselves are in need, they prefer them over themselves.', source: 'Ḥashr 9 (meaning)' },
      "The generosity of the Anṣār is recounted in breathtaking scenes: some split their wealth in two and said 'half is yours'; some offered to share their date orchard. The emigrants' answer was no less noble: ʿAbd al-Raḥmān ibn ʿAwf, who said 'May your wealth be blessed; just show me the way to the market,' chose to stand on his own feet through trade. One side raced to give, the other raced not to hold out its hand.",
      "Muʾākhāt was, beyond social policy, a revolution of the heart: people who had warred for centuries with tribal fanaticism came to know a new kind of kinship called 'the brotherhood of faith.' A society was born where Aws and Khazraj, Meccan and Medinan, the freed slave Bilāl and the noble merchant, were made equal in the same row.",
      "Rebuilding muʾākhāt today is in our hands: being able to say 'my brother' to the one newly moved to our city, newly started at work, newly joined among us. Doing the favor not 'as if giving charity' but 'as if delivering a right.' You need not be a Medinan to be an Anṣārī — there is always a migrant knocking at our door.",
    ],
  },
  veda: {
    title: 'The Farewell Sermon: A Universal Declaration',
    excerpt: 'A speech delivered to over a hundred thousand people, valid until the end of time.',
    paragraphs: [
      "The tenth year of the Hijra, at ʿArafāt. On the only Hajj of his life, the Prophet (peace be upon him) addressed over a hundred thousand Companions. He began his speech with 'Perhaps I will never meet you here again after this year' — and this 'farewell' raised his words to the weight of a testament.",
      { quote: 'O people! Your lives, your property, and your honor are as sacred to one another as the sanctity of this day of yours, this month of yours, this land of yours.', source: 'Farewell Sermon (Muslim, Ḥajj 147)' },
      "The principles of the sermon were far ahead of their age: blood feuds were abolished — 'All blood feuds of the Age of Ignorance are under my feet.' Usury was abolished — and the first abolished was the debt owed to the Prophet's own uncle; the principle began with the nearest. Women's rights were emphasized: 'Fear Allah concerning women; you have rights over them, and they have rights over you.'",
      "And that sentence — perhaps the earliest, clearest declaration of human equality: 'No Arab has superiority over a non-Arab, nor a non-Arab over an Arab; no white over black, nor black over white. Superiority is only in taqwā.' The living flesh and bone of Ḥujurāt 13: humankind is from a single mother and father; divided into peoples so that they might come to know one another.",
      "At the end of the sermon a seal came from the heavens: 'This day I have perfected your religion for you' (Māʾida 3). The Prophet asked the crowd, 'Have I conveyed the message?' When cries of 'Yes!' filled ʿArafāt, he repeated three times: 'Bear witness, O Lord!' Some eighty-odd days later he passed away. The Farewell Sermon is therefore not merely a speech but a sealed trust — one that tells the reader, 'the turn to bear witness is now yours.'",
    ],
  },
  // ─────────── HEART & SPIRITUALITY ───────────
  tevekkul: {
    title: 'Tawakkul: Tie Your Camel, Then Trust',
    excerpt: 'The name of the fine balance between precaution and surrender.',
    paragraphs: [
      "A man asked the Prophet, 'Should I tie my camel and trust in Allah, or leave it loose?' The answer became the age-old definition of tawakkul: 'First tie it, then trust' (Tirmidhī, Qiyāma 60). Tawakkul is not the alternative to precaution; it is the inner peace that begins where precaution ends.",
      { quote: 'Whoever trusts in Allah, He is sufficient for him.', source: 'Ṭalāq 3 (meaning)' },
      "False tawakkul is lived at two extremes. The first becomes a cover for laziness: saying 'Allah will provide' without working is leaving the camel loose. The second is the captivity of anxiety: taking every precaution yet still being unable to sleep, trying to carry the outcome on your own shoulders. True tawakkul stands between the two — do what you can, and leave the outcome to its Owner.",
      "Āl ʿImrān 159 clarifies the order: 'Consult them in the matter; and when you have decided, then trust in Allah.' First consultation, reflection, planning; then resolve; and finally surrender. The Prophet's life is an exhibition of this balance: he went out to Uhud wearing his armor, threw off his pursuers in the cave during the Hijra, protected the city with a trench at Khandaq — and at every step his heart leaned on his Lord.",
      "The fruit of tawakkul is psychological too: the person who can say 'I did all I could' is not scorched by regret whatever the outcome; he can say 'so this was what was best for me.' In an age of anxiety, tawakkul is the believer's refuge: like a bird — it leaves hungry in the morning and returns full at evening; but it never stops flying.",
    ],
  },
  sukur: {
    title: 'Gratitude: The Key That Multiplies Blessings',
    excerpt: 'The difference between saying "Alhamdulillah" and living a life of gratitude.',
    paragraphs: [
      "In the Qur'an, Allah declares a promise with the force of an oath: 'If you are grateful, I will surely increase you' (Ibrāhīm 7). The relationship between gratitude and blessing is not one-way: blessing gives birth to gratitude, and gratitude multiplies blessing. Ingratitude is turning down the tap with your own hand.",
      { quote: 'O family of Dāwūd! Work in gratitude. Few of My servants are truly grateful.', source: 'Sabaʾ 13 (meaning)' },
      "The subtlety of this verse is in the verb: it does not say 'be grateful' but 'work in gratitude.' So gratitude is not only a word but a deed. Scholars describe gratitude in three layers: the gratitude of the tongue — mentioning the Giver of the blessing; the gratitude of the heart — knowing the blessing came from Him; the gratitude of the body — using the blessing where its Giver would be pleased. The gratitude of the eye is guarding it from the forbidden, of wealth is sharing, of knowledge is teaching.",
      "The Prophet (peace be upon him) also trains our perspective on gratitude: 'Look at those below you, not at those above you; this is more fitting so that you do not belittle Allah's blessing upon you' (Muslim, Dhikr 73). In the age of social media this hadith is practically a prescription: the eye that always looks at 'more' becomes unable to see what it has.",
      "A simple exercise to put gratitude into practice: each night count three blessings — but not always the same ones; find three specific, small, overlooked things from today. A glass of cold water, a tooth that does not ache, a timely message from a friend. A heart that goes hunting for blessings begins, after a while, to see blessings everywhere. That heart is rich.",
    ],
  },
  tefekkur: {
    title: 'Contemplation: Reading the Book of the Universe',
    excerpt: 'The difference between looking at the sky and seeing the sky: an hour of deep reflection.',
    paragraphs: [
      "The first command of the Qur'an was 'Read' — yet there was as yet no written book. Because the first book to be read was the universe. Sūrat al-Ghāshiya gives the headings of this reading: 'Do they not look at the camel, how it was created? At the sky, how it was raised? At the mountains, how they were fixed?' (Ghāshiya 17-19). Looking is everyone's task; seeing belongs to the one who contemplates.",
      { quote: 'In the creation of the heavens and the earth, and the alternation of night and day, are signs for people of understanding. They remember Allah standing, sitting, and lying on their sides, and reflect on the creation of the heavens and the earth.', source: 'Āl ʿImrān 190-191 (meaning)' },
      "It is reported that when these verses were revealed the Prophet wept and said, 'Woe to whoever recites these verses and does not reflect upon them.' Contemplation is the laboratory of faith: the bridge between believing by rote and believing by seeing is built there. The saying reported from the early scholars — 'An hour of contemplation may be better than (voluntary) worship' — expresses this depth.",
      "Modern life is the natural enemy of contemplation: screens that fill every gap leave no soil for thought to sprout. Being bored — that old, fruitful boredom — has become nearly impossible. Yet deep thought is born in exactly that emptiness.",
      "For a practice of contemplation, a humble beginning: ten minutes a day, phone-free. Look at the sky — think of the tons of water a cloud carries. Look at your hand — that your fingerprint is on no one else. Look at your breath — that faithful rhythm that continues even while you sleep. The call of Sūrat al-Rūm is exactly this: 'Have they not reflected within themselves?' (Rūm 8). The book of the universe prints a new edition every day; it awaits its reader.",
    ],
  },
  sabir: {
    title: 'Patience: The Stance Shown at the First Blow',
    excerpt: 'Is patience waiting, or turning the wait into worship?',
    paragraphs: [
      "One day the Prophet (peace be upon him) advised patience to a woman weeping at a grave. Not recognizing him, she snapped, 'You don't know my grief'; then, learning who he was, she came to apologize. The Prophet's answer set the definition of patience: 'Patience is only that shown at the first shock' (Bukhārī, Janāʾiz 32). Everyone calms down with time; the virtue is standing upright the moment you first take the blow.",
      { quote: 'O you who believe! Seek help through patience and prayer. Indeed, Allah is with the patient.', source: 'Baqara 153 (meaning)' },
      "Scholars divide patience into three branches: patience in persisting in worship — being able to rise anew every morning; patience in staying away from sin — resisting the whisper 'just once won\'t hurt'; and patience against calamity — not rebelling when you lose. All three draw from the same root: trust in Allah's promise.",
      "Patience is not passivity; the heroes of patience in the Qur'an are always in motion. Jacob, while awaiting his son, says 'ṣabr jamīl' (a beautiful patience) yet sends his sons to search in Egypt. Job is patient with his illness yet also supplicates for a cure. Patience is not complaining while leaving the outcome to Allah after doing everything that can be done.",
      "Its reward too is unlike other deeds: 'The patient will be given their reward without measure' (Zumar 10). While in Paradise most blessings are given by measure, the reward of patience is without measure. For patience is the test given at the very heart of the trial. A small exercise to begin today: when hardship comes, let your first sentence be not complaint but 'Innā lillāh...' — let the first moment be yours.",
    ],
  },
  dogruluk: {
    title: 'Truthfulness: The Road That Sets the Heart at Ease',
    excerpt: 'Between the cost of a small lie and the peace of truthfulness.',
    paragraphs: [
      "The Prophet (peace be upon him) drew the route of truthfulness: truthfulness leads to goodness, and goodness to Paradise; a person who keeps telling the truth is written down before Allah as 'ṣiddīq' (utterly truthful). Lying leads to wickedness, and wickedness to the Fire; a person who keeps lying is written down as 'kadhdhāb' (great liar) (Bukhārī, Adab 69). Our sentences, one by one, unknowingly build an identity.",
      { quote: 'O you who believe! Fear Allah and be with the truthful.', source: 'Tawba 119 (meaning)' },
      "The litmus test of truthfulness in daily life is the small moments: the text saying 'I'm on my way,' the excuse 'I'm in a meeting,' telling a child 'I'll buy it later' and forgetting. The Prophet taught that even saying to a child 'come, I'll give you something' and not giving counts as a lie. In Islam there is no category of 'small lie'; what seems small is the seed of a habit.",
      "The Prophet gave the measure of truthfulness in a single sentence: 'Leave what makes you doubt for what does not make you doubt; for truthfulness is peace of heart, and lying is doubt' (Tirmidhī, Qiyāma 60). The liar must constantly keep accounts — he must not forget who he told what. The truthful person has no such burden; his memory is one, his face is one.",
      "Truthfulness in trade holds a rank of its own: it is reported that 'the truthful, trustworthy merchant is with the prophets, the ṣiddīqs, and the martyrs.' The tradesman who declares the flaw in his goods may lose a sale that day; but what he gains weighs far heavier on the scale: blessing and reputation. Truthfulness is costly in the short term, the most profitable investment over a lifetime.",
    ],
  },
  sadaka: {
    title: 'Charity: The Secret That Multiplies Wealth',
    excerpt: 'Giving seems to defy arithmetic — until you come to know blessing (baraka).',
    paragraphs: [
      "The Qur'an describes spending with the likeness of a seed: the example of those who spend in the way of Allah is like a seed that grows seven ears, in each ear a hundred grains (Baqara 261). Arithmetic says 'if you give, it decreases'; revelation says 'if you give, it multiplies.' The Prophet confirms it too: 'Charity does not decrease wealth at all' (Muslim, Birr 69).",
      { quote: 'You will never attain goodness until you spend from that which you love.', source: 'Āl ʿImrān 92 (meaning)' },
      "The most accepted form of charity is secrecy: among the seven kinds of people who will be sheltered in the shade of the Throne on the Day of Resurrection is 'the one who gives charity so secretly that his left hand does not know what his right hand gave' (Bukhārī, Adhān 36). Secrecy protects the deed from show and guards the dignity of the recipient — the giving hand must not redden the face of the one who receives.",
      "Islam also lifts charity out of being only the work of the wealthy: 'Your smile at your brother is charity,' it is said; removing something harmful from the road, a kind word, even the morsel you feed your own family is counted as charity. Charity is not a transfer of money but a way of life: an eye that asks not 'what will it cost me?' but 'what can pass through me?'",
      "And continuity: the Prophet taught that the most beloved of deeds to Allah is 'the one done constantly, even if small.' Rather than one large donation a month, be a small fountain that flows every day. Ongoing charity (ṣadaqa jāriya) — a child you educate, a tree you plant, useful knowledge you share — keeps writing to your record even after you have departed this world.",
    ],
  },
  zikir: {
    title: 'Remembrance: The Breathing of the Heart',
    excerpt: 'Hearts find peace only in remembering Him — but how is that remembrance done?',
    paragraphs: [
      "Modern people seek peace outside: on vacation, in shopping, on a screen. The Qur'an points to the address within: 'Know that hearts find peace only in the remembrance of Allah' (Raʿd 28). Remembrance (dhikr) is the breathing of the heart — what oxygen is to the body, the remembrance of Allah is to the heart.",
      { quote: 'O you who believe! Remember Allah abundantly and glorify Him morning and evening.', source: 'Aḥzāb 41-42 (meaning)' },
      "The Prophet (peace be upon him) cast remembrance into formulas light enough for everyone to carry. The most famous is this: 'Two words are light on the tongue, heavy on the scale, beloved to the Most Merciful: Subḥānallāhi wa bi-ḥamdih, Subḥānallāhi'l-ʿaẓīm' (Bukhārī, Daʿawāt 65). A ten-second phrase — mountain-heavy on the scale.",
      "Remembrance is not only the work of the tongue. Scholars describe its three layers: the remembrance of the tongue — glorification, testifying His oneness, seeking forgiveness; the remembrance of the heart — recalling the Giver in every blessing; the remembrance of the body — using the limbs in works He is pleased with. The beads told while waiting in traffic are the remembrance of the tongue; wronging no one in that traffic is the remembrance of the body.",
      "For a practical start, the 'anchor moments' method: attach remembrance to your existing daily habits. Three istighfārs on getting in the car, ten blessings on the Prophet while the tea steeps, thirty-three glorifications on lying down in bed. The tasbīḥāt after prayers is already a ready rhythm. When the day is woven like this, the 'abundant remembrance' of Aḥzāb 41 becomes not a burden but the background music of life.",
    ],
  },
  hira: {
    title: 'The Sun Rising from Ḥirāʾ',
    excerpt: 'The turning-point night of human history: the moment the command "Read!" descended.',
    paragraphs: [
      "One night of the month of Ramadan, the small cave on the Mountain of Light. The forty-year-old Muhammad (peace be upon him), as he had done for years, was in contemplation far from the noise of the city. That night Gabriel came and, with a one-word command, split the history of humanity in two: 'Read!'",
      { quote: 'Read in the name of your Lord who created! He created man from a clinging clot. Read! And your Lord is the most generous, who taught by the pen.', source: 'ʿAlaq 1-4 (meaning)' },
      "Despite the answer 'I do not know how to read,' the command was repeated three times — as if this message were being given: this reading is a reading not of letters but of truth, and the One who teaches it is your Lord Himself. It is striking: the first word of revelation is not 'believe,' 'fight,' or 'rule,' but 'read'; and the first tool introduced is the pen. Knowledge is written into this religion's birth certificate.",
      "Descending the mountain trembling, the Prophet took refuge with his wife: 'Cover me!' Khadīja's answer is a masterpiece of understanding people: 'Never! Allah will never disgrace you. For you maintain ties of kinship, speak the truth, carry the burden of the helpless, honor the guest, and help those on the path of truth' (Bukhārī, Badʾ al-Waḥy 3). Khadīja read prophethood not from miracles but from forty years of character.",
      "What Ḥirāʾ whispers to today: great calls are heard not in noise but in silence — open for yourself caves of contemplation. And be a Khadīja to those around you: on the day they are shaken, remind them of their virtues. Sometimes what keeps a person standing is a single voice that tells them who they are.",
    ],
  },
  taif: {
    title: 'Ṭāʾif: The Mercy of the Hardest Day',
    excerpt: 'The supplication a stoned prophet made for those who stoned him.',
    paragraphs: [
      "It was the heaviest period of the years of prophethood: his protector, his uncle Abū Ṭālib, and his greatest supporter, Khadīja, had passed away in the same year — the Year of Sorrow — and Mecca's oppression had become unbearable. The Prophet walked hopefully to Ṭāʾif; perhaps this city would listen. They did not. They incited the city's mob and had him stoned; his blessed feet left the city covered in blood.",
      "When he took shelter in the shade of an orchard, the supplication that fell from his lips was the prayer not of defeat but of surrender: 'O Allah! To You I complain of the weakness of my strength, the scarcity of my means, my lowliness before people... So long as You are not angry with me, I do not mind what I endure.' Even the complaint was made to Allah — not to people.",
      { quote: 'We sent you only as a mercy to the worlds.', source: 'Anbiyāʾ 107 (meaning)' },
      "Then that moment came: Gabriel appeared, with the angel of the mountains beside him. The offer was clear: 'If you wish, I will crush these two mountains upon them.' The answer of the Prophet, drenched in blood, became the definition of 'a mercy to the worlds': 'No! I hope that Allah will bring forth from their offspring generations who worship Him alone' (Bukhārī, Badʾ al-Khalq 7). Years later Ṭāʾif became Muslim — that supplication held.",
      "The lesson of Ṭāʾif is hard but clear: do not curse the door that closes on you; think of the coming generation behind that door. The mercy you show at the moment you are most in the right is your strongest moment. And do not forget: the one who stones you today may be at your side tomorrow — like the grandchildren of the children of Ṭāʾif.",
    ],
  },
  ihlas: {
    title: 'Sincerity: The Unseen Soul of the Deed',
    excerpt: 'Two people do the same deed; one rises, one falls to nothing. Where is the difference?',
    paragraphs: [
      "Bukhārī, by a deliberate choice, begins his monumental work with this hadith: 'Deeds are only by intentions; each person has only what he intended' (Bukhārī 1). Two people, in the same mosque, in the same row, pray the same prayer — one for Allah, one to be seen. From the outside their photographs are the same; on the scale their weights differ by worlds.",
      { quote: 'So whoever hopes to meet his Lord, let him do righteous deeds and associate none as partner in the worship of his Lord.', source: 'Kahf 110 (meaning)' },
      "The enemy of sincerity is riyāʾ — the desire to display the deed to people. The Prophet named it 'hidden shirk'; for the show-off awaits the reward of the deed not from Allah but from people. The age of social media has doubled this test: once every good deed can be shared, the question 'for whom did I do it?' must be asked anew every day. Sharing is not always riyāʾ — it may carry an intention to encourage; the measure is how the heart reacts when no 'likes' come.",
      "Ways to protect sincerity: keep a secret compartment of worship — a voluntary prayer, a charity, a supplication no one knows of; that compartment is the heart's private line with Allah. Trust not in your deed but in the One who accepts it: whoever says 'my deed is great' falls into arrogance, whoever says 'I have deeds' falls into complacency. And renew the intention through the day — intention is not a clock set once but a compass constantly adjusted.",
      "Sūrat al-Bayyina sums up the goal: 'They were commanded only to worship Allah, devoting religion purely to Him' (Bayyina 5). A little but pure is better than much but ostentatious. For Allah seeks not abundance but purity.",
    ],
  },
  umit: {
    title: 'Never Despairing of Mercy',
    excerpt: 'The verse that descends upon everyone who says "my sin cannot be forgiven."',
    paragraphs: [
      "The most hope-laden verse of the Qur'an addresses people who have known no limit in sin: 'Say: O My servants who have transgressed against themselves! Do not despair of the mercy of Allah. Indeed, Allah forgives all sins' (Zumar 53). Note the delicacy of address: even those who transgress are called 'My servants' — the door is open even to the most distant.",
      { quote: 'Allah has a hundred mercies; of them He has sent down only one to the earth — with it creation shows mercy to one another. The ninety-nine He has kept with Himself to show mercy to His servants on the Day of Resurrection.', source: 'Muslim, Tawba 21' },
      "This hadith overturns all our calculations about mercy: a mother's tenderness for her child, the kindness of all humanity toward one another — all are crumbs of that single mercy. The ninety-nine are not even on the stage yet. Despair is born of not knowing this treasure.",
      "The door of repentance too is wider than supposed: the Prophet reports that Allah rejoices at His servant's repentance more than a man who lost his camel in the desert and then found it. And the example of a Prophet who had istighfār every day: though sinless, he sought forgiveness seventy (in one narration, a hundred) times a day (Bukhārī, Daʿawāt 4). Istighfār is not the sinner's shame but the servant's essential breath.",
      "Hope and fear are like the two wings of a bird: the one who flies with fear alone falls into despair, the one who flies with hope alone into laxity. The balance is this: when looking at sin, recall justice so you do not grow bold; when turning to repentance, recall mercy so you do not collapse. And whatever point you are at today, know this: the way back is always shorter than the depth of the well you fell into.",
    ],
  },
  // ─────────── ISLAMIC MORALS (cont.) ───────────
  komsu: {
    title: 'The Neighbor\'s Right: The Trust on the Other Side of the Wall',
    excerpt: 'Gabriel counseled care for the neighbor so much that the Prophet said, "I thought he would make him an heir."',
    paragraphs: [
      'The Prophet (peace be upon him) said: "Gabriel kept counseling me about the neighbor so much that I thought he would make him an heir" (Bukhārī, Adab 28). This right, which the angel of revelation insistently recalled, shows that in Islamic ethics neighborliness is not an ordinary social relationship but a trust drawn from the very core of the religion.',
      { quote: "Worship Allah and associate nothing with Him. And be good to parents, relatives, orphans, the poor, the near neighbor, the far neighbor, the companion at your side, the traveler, and those under your care...", source: 'Nisāʾ 36 (meaning)' },
      'The verse counts the neighbor in the same list as parents and relatives — moreover mentioning both separately as "the near neighbor" and "the far neighbor." Commentators have interpreted this as both distance and degree of closeness: your next-door neighbor, the one at the far end of the district, even the name you do not know in your apartment block today, is all within this circle.',
      'The measure is set clearly: "Whoever believes in Allah and the Last Day, let him be good to his neighbor" (Bukhārī, Adab 31; Muslim, Īmān 74). In another narration it is reported that the faith of the person whose neighbor is not safe from his harm will not reach perfection (Muslim, Īmān 73). So neighborliness is the field test of the claim to faith: when you raise your voice, share a parking spot, in smell and noise — are you taking your neighbor into account?',
      'The minimum of the neighbor\'s right is to cause no harm, the middle is a greeting and a smiling face, and the summit is to ask after their troubles. The traditions include highly concrete counsels, such as adding extra broth to the food you cook and sending some to the neighbor. Its equivalent today is perhaps this: putting down the phone to greet them when you meet at the door, carrying the elderly neighbor\'s bag, checking on the one who has not been seen for a long while.',
      'The person on the other side of the wall is a relative you did not choose but whom Allah has entrusted to you. A small step today: exchange greetings with a neighbor whose name you do not know — perhaps behind that wall, a single greeting away, a friend is waiting.',
    ],
  },
  annebaba: {
    title: 'The Right of Parents: Do Not Even Say "Ugh"',
    excerpt: "The Qur'an commands kindness to parents immediately after servitude to Allah — even a single-syllable objection is forbidden.",
    paragraphs: [
      'There is a subtlety of manners in the Qur\'an over which one can never reflect enough: Allah, in the continuation of the verse in which He commands worship of Himself, commands kindness to parents without placing anything in between. The order is deliberate — the first right of a servant, coming right after monotheism, is the right of those who raised us.',
      { quote: 'Your Lord has decreed that you worship none but Him, and that you be kind to parents. If one or both of them reach old age with you, do not say to them even "ugh," nor scold them; but speak to them a gracious word.', source: 'Isrāʾ 23 (meaning)' },
      'The measure of the verse is striking: what is forbidden is not insult or shouting — it is "ugh," the shortest exclamation of weariness in Arabic. Where even a single syllable is not allowed, consider for yourself the ruling on the raised voice, the impatient glance, the "are you telling this again" sigh. The following verse crowns the measure with a supplication: "My Lord! Have mercy on them as they raised me when I was small" (Isrāʾ 24).',
      'Sūrat Luqmān emphasizes the mother\'s right in particular: "His mother carried him through hardship upon hardship, and his weaning is in two years. Be grateful to Me and to your parents" (Luqmān 14). When one of the Companions asked the Prophet, "Who is most deserving of my good company?" he received the answer "Your mother" three times, and on the fourth, "your father" (a narration within the frame of Muslim, Birr 1-3).',
      'When a Companion asked which deed is most beloved to Allah, the Prophet listed: "Prayer at its proper time, then kindness to parents, then striving in the way of Allah" (Bukhārī, Mawāqīt 5). That kindness to parents is counted before striving shows the weight of this right.',
      'While they are alive the opportunity still stands: today a phone call, a visit, a "please forgive me my due" — too precious to leave for tomorrow. If they have passed away the door is still not closed: supplicating and seeking forgiveness for them, fulfilling their bequests, and looking after their friends are the ways of continuation taught in the traditions.',
    ],
  },
  cuma: {
    title: 'Friday: The Festival at the Heart of the Week',
    excerpt: "The believer's weekly gathering: leaving off trade at the call and hurrying to that summons.",
    paragraphs: [
      'The Prophet (peace be upon him) taught that the best day upon which the sun rises is Friday; according to the tradition Adam (peace be upon him) was created that day and placed in Paradise that day (Muslim, Jumuʿa 17-18). The weekly rhythm of the Muslim society is built around this day: gathering, the sermon, communal supplication — its very name means "the day of gathering."',
      { quote: 'O you who believe! When the call is made for prayer on Friday, hasten to the remembrance of Allah and leave off trade. That is better for you, if you only knew. And when the prayer is concluded, disperse through the land and seek of Allah\'s bounty.', source: "Jumuʿa 9-10 (meaning)" },
      'The balance of the verse is striking: at the call, worldly work stops; when the prayer ends, "disperse through the land, seek your provision" is said. Islam neither cancels the world for religion nor postpones religion for the world — Friday is a calibration point placed at the middle of the week: stop, gather, renew your direction, then return to your work with blessing.',
      'A distinctive list of manners for Friday appears in the traditions: performing ghusl, dressing cleanly and well, wearing a pleasant scent, going early, listening silently to the sermon. The Prophet taught that even saying "be quiet" to the person beside you during the sermon would blemish one\'s Friday reward (within the frame of Bukhārī, Jumuʿa 36). Reciting Sūrat al-Kahf that day and sending abundant blessings upon the Prophet are also encouraged in the traditions.',
      'Within Friday there is also a hidden treasure: the Prophet informed us that there is a moment on Friday such that if a Muslim servant coincides with it and asks Allah for some good, Allah will surely give it to him (within the frame of Bukhārī, Jumuʿa 6). Most scholars have sought this moment between the ʿaṣr and maghrib prayers — a short supplication made with an open heart in those hours may be the week\'s most precious investment.',
      'An intention from today: this Friday, to be ready before the call; during the sermon, to turn not the phone toward the pocket but the heart toward the prayer-niche. If Friday is a festival, one does not arrive late to a festival.',
    ],
  },
};

export default ARTICLES_EN;
