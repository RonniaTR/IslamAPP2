// frontend/src/data/stories.en.js
// 🇬🇧 English content for the parables (İbretlik Hikayeler).
// Keyed by story id. Fields overlaid: title, paragraphs[], question,
// choices[], lesson, verse:{text}, and for layered stories checkpoints[]
// ({q, choices[], insight}). Verse sources stay in stories.js.
// Written natively; Qur'an meanings in our own words with source cited.

export const STORIES_EN = {
  'kor-cocuk': {
    title: 'Two Signs',
    paragraphs: [
      'A blind boy sat on the corner of a busy street. In front of him was a hat, and beside it a handwritten sign: "I am blind, please help." A few coins had gathered in the hat; that was all.',
      'A passer-by stopped. He took some money from his pocket and dropped it in the hat. Then he picked up the sign, turned it over, wrote a few words on the back, set it where everyone could read it, and walked on.',
      'That afternoon the hat began to overflow. Far more people were giving to the boy. Toward evening the man who had changed the sign came back to see. The boy recognized his footsteps: "Were you the one who changed my sign this morning? What did you write?"',
      'The man smiled: "I only wrote the truth. I said what you said, in a different way." What he had written was: "Today is a beautiful day, and I cannot see it."',
    ],
    question: 'Both signs told the same truth. Why did the second one move hearts?',
    choices: [
      'Because it invited people to be grateful for what they had',
      'Because it drew more pity',
      'Because it was written in bigger letters',
    ],
    lesson: 'The first sign announced a lack; the second reminded the reader of the blessing he already had. The same words, spoken through the right window, reach the heart. Gratitude usually begins not with noticing "what we do not have," but with noticing "the blessing we overlook." Eyes that see, feet that walk, every breath we take — all are part of that "beautiful day."',
    verse: { text: '"Indeed, if you are grateful, I will surely increase you (in favour)."' },
  },
  'marangoz': {
    title: "The Carpenter's Last House",
    paragraphs: [
      'An old master carpenter told the employer he had served for many years that he wished to retire. He wanted to rest now, to spend time with his grandchildren. Leaving work meant losing his income, but he had made up his mind.',
      'The employer was saddened; he did not want to lose this valued master. "I have one last request," he said. "Build me one more house; then go as you please." The carpenter agreed, but his heart was not in it.',
      'He worked half-heartedly. He chose poor materials, neglected his craftsmanship, took careless measurements. The master of years produced the shoddiest work of his life. The house was finished; it was nothing like his others.',
      'The employer came, walked through the house, then placed the key in the carpenter\'s palm: "This house is yours. A small gift for your years of labour." The carpenter froze. Had he known he would live in this house himself, how carefully he would have driven every nail!',
    ],
    question: 'Whose house was the carpenter really building?',
    choices: [
      'His own future — every deed is a brick of our own house',
      "Only his employer's house",
      'A wasted job',
    ],
    lesson: 'We are all building a house every day: the work we do, the decisions we make, the relationships we form are its bricks. Often we cut corners, thinking "it is for someone else anyway"; yet what we build is our own Hereafter. To do a task not merely "for the sake of duty" but with the awareness "I am doing this for myself" — that is sincerity. Every nail you drive today is the house you will live in tomorrow.',
    verse: { text: '"And that man shall have nothing but what he strived for."' },
  },
  'tohum': {
    title: 'The Emperor and the Seed',
    paragraphs: [
      'An aging ruler had no children. He needed to choose someone to leave his throne to. He held no ordinary contest: he summoned young people from every corner of the land and gave each of them a single seed.',
      '"Plant this seed, grow it," he said. "Come back in six months with your pot. Whoever raises the finest plant will sit on the throne after me."',
      'One of the youths, a boy named Emin, planted his seed with care. He watered it every day, set it in the sun, waited patiently. But weeks passed, months passed — nothing came up from the pot. He was ashamed and dejected; while his neighbours\' pots filled with colourful flowers, his stayed empty.',
      'When six months were up, all the youths came to the palace with magnificent plants. Emin stood at the very back, head bowed, with his empty pot. The ruler walked through the hall, glanced over the flowers — then stopped before Emin\'s empty pot and announced aloud: "Here is your future ruler."',
      'Everyone was stunned. The ruler explained: "I had roasted all the seeds I gave you; none could sprout. There was only one person honest enough to bring this empty pot — and he is the one worthy of the throne."',
    ],
    question: "What did the other youths' colourful pots reveal?",
    choices: [
      'The rush to appear successful at the cost of losing honesty',
      'That they were genuinely more talented',
      'That they worked harder',
    ],
    lesson: 'Everyone swapped the seed to "look successful"; only one chose honesty with his empty pot. The world often applauds "the result," not "honesty." Yet the Owner of the trust looks not at the full pot but at the clean heart. Being truthful sometimes pushes you to the back, to the loneliest corner — until the truth is announced. The price we pay to save appearances is often the very core we lose.',
    verse: { text: '"O you who believe! Fear Allah and be with the truthful."' },
  },
  'iki-deniz': {
    title: 'Two Seas from the Same Water',
    paragraphs: [
      'In one land there are two great lakes, and the same river feeds both. From the same source, the same fresh water flows into each. Yet these two lakes are utterly different.',
      'The first is surrounded by green. On its shores are trees, fish, flocks of birds, the sounds of children. Water enters it, passes through, and flows out again by another branch to continue its way. It gives what it takes; that is why it is alive.',
      'The second is like a dead thing. No fish live on its shore, no green grows, no bird visits. Its water is so salty that nothing can survive. This lake never lets out the water it receives — it keeps every drop within. It only takes, never gives.',
      'People call the first "the sea of life" and the second "the dead sea." The only difference between them: one shares, the other hoards.',
    ],
    question: 'What set the two lakes apart?',
    choices: [
      'Whether they gave out what they took in',
      'That the source of the water was different',
      'That one was larger',
    ],
    lesson: 'A person is like these two lakes. One pours out the knowledge, wealth and love he has onto those around him — and is blessed, comes alive, makes his surroundings green. Another keeps everything to himself, holds it, hoards it — and quietly dries up within. Giving does not diminish wealth; on the contrary, it revives the soul. The giving hand is a sea of life. Generosity is not a loss but a flow.',
    verse: { text: '"You will never attain righteousness until you spend from what you love."' },
  },
  'civi': {
    title: 'The Nails in the Fence',
    paragraphs: [
      'A father had a hot-tempered son. He would flare up over the smallest thing and speak hurtful words to those he loved. One day the father handed him a bag of nails: "Whenever you get angry and say something hurtful to someone, drive a nail into the wooden fence in the garden."',
      'On the first day the boy drove thirty-seven nails. But as the days passed, he realized that holding his temper was easier than driving nails into the fence. The number of nails dropped each day. A day came when he drove none.',
      'When he told his father, the father gave a new task: "Now, for every day you hold your temper, pull one nail out of the fence." Time passed; one day the boy proudly announced he had pulled out all the nails.',
      'The father led him to the fence: "Well done, my son. But look at this wood." Where the nails had been pulled out, deep holes remained. "The fence is no longer as it was. Every word said in anger leaves a mark like this. Even if you pull the nail out, the hole stays."',
    ],
    question: 'What did the father really want to show the boy?',
    choices: [
      'That hurtful words leave a mark even if we apologize',
      'That driving nails is hard',
      'That the fence cannot be repaired',
    ],
    lesson: 'A word spoken in anger is an arrow shot — you cannot call it back. To say "I am sorry" is good; it tries to mend the holes, but some wounds leave scars. That is why the real issue is not pulling the nail out, but never driving it in. The Prophet ﷺ taught the angry person to "be silent, sit down, seek refuge" — for a word left unsaid is always better than a word that must be taken back. To guard your tongue is to not drive a nail into the fence.',
    verse: { text: '"...Those who restrain their anger and pardon people. Allah loves those who do good."' },
  },
  'kelebek': {
    title: "The Butterfly's Cocoon",
    paragraphs: [
      'A man saw a small opening appear at the tip of a cocoon. Curious, he stopped to watch. For hours the butterfly inside struggled and strained to get out through that tiny hole.',
      'A moment came when the butterfly seemed to get stuck. It could no longer advance; it looked as if it would never pass through that little opening. The man could not bear it. Meaning to help, he took a pair of scissors, cut the rest of the cocoon and widened the hole. The butterfly came out easily.',
      'But something was wrong: its body was swollen, its wings crumpled and feeble. The man waited for the butterfly to spread its wings and fly. That moment never came. The butterfly lived out its life crawling with that swollen body; it never flew.',
      'What the man did not know was this: the butterfly\'s hard passage through the narrow hole was not a torment but a necessity. During that struggle, the fluid in its body is pumped into its wings; only through this effort does the butterfly gain the strength to fly. The hand that removed the difficulty had, in fact, taken away the ability to fly.',
    ],
    question: 'What did the man\'s "help" cost?',
    choices: [
      'It took away the struggle the butterfly needed to develop',
      'It saved the butterfly some time',
      'Nothing — it only helped',
    ],
    lesson: 'Some hardships exist not for us to be spared, but to strengthen us. To lift every difficulty at once, to soothe every pain instantly, is often not mercy but blocking the path of growth. Allah does not give His servant a trial in vain; the strength we gain passing through that narrow hole is the secret of our next flight. While our prayer for ease is answered, sometimes "the strength to endure hardship" is the greatest gift.',
    verse: { text: '"Indeed, with hardship comes ease."' },
  },
  'balikci': {
    title: 'The Fisherman and the Businessman',
    paragraphs: [
      'A wealthy businessman went on holiday to a small coastal town. At midday he saw a fisherman on the pier, lying on his back in the sun, resting in peace. In his boat were a few fresh fish.',
      '"What fine fish," said the businessman. "How long did it take to catch these?" The fisherman smiled: "Not long, a few hours." — "Then why not stay longer and catch more?" The fisherman shrugged: "This much is enough for my family\'s needs."',
      '"But what do you do with your spare time?" the businessman pressed. The fisherman explained: "I wake late, catch a little fish, play with my children, rest with my wife in the afternoon, go down to the village in the evening, chat and laugh with my friends. My day is full."',
      'The businessman grew serious: "Look, let me help you. Catch more fish, save the money, buy a second boat. Then a fleet. Sell fish to a factory, move to the city, build a big company." — "And then?" said the fisherman. "Then," said the businessman, his eyes shining, "you sell your company, retire with millions, settle in a small coastal town; wake late, catch a little fish, play with your children, chat with your friends in the evening!"',
      'The fisherman was silent for a while. Then he smiled: "But I am already doing that right now."',
    ],
    question: "Where did the businessman's years-long plan arrive?",
    choices: [
      'The peace the fisherman already had',
      'True wealth and happiness',
      'A far better life than the fisherman',
    ],
    lesson: 'Often we sacrifice today\'s peace "to find peace someday." We run for years — and the place we finally reach is what was in our hands from the start: sufficiency, family, friendship, gratitude. Islam calls this "contentment" (qana\'ah): to be satisfied with little and not burn out the soul chasing more. "More" is always beyond the next hill; yet whoever knows how to be content is already at the summit. Wealth is not the abundance of goods but the contentment of the heart.',
    verse: { text: '"And whoever relies upon Allah — then He is sufficient for him."' },
  },
  'bin-deve': {
    title: 'A Thousand Camels',
    paragraphs: [
      'A rich merchant had a thousand camels. As his caravan crossed the desert, he met a sage. The merchant boasted of his wealth: "I have a thousand camels, more than you could count."',
      'The sage asked: "Do these camels give you peace, or worry?" The merchant paused: "To be honest, I cannot sleep at night. What if disease strikes, if they are stolen, if they perish on the road... Losing even one burns my heart."',
      'The sage smiled: "So the camels are not yours; you have become theirs. They do not carry you; you carry their burden. If your wealth has made you its servant — are you the owner, or is it?"',
      'The merchant thought long that night. The next morning he distributed some of his camels to the poor, had wells dug with some, and put the rest to lawful use. For the first time, the loss of a camel did not make him weep at night. Because now he was bound not to the camels, but to the One who gave them.',
    ],
    question: "What changed to bring the merchant peace?",
    choices: [
      'Learning to own wealth without becoming its slave',
      'Selling all his camels',
      'Buying more camels',
    ],
    lesson: 'Wealth is a blessing when it is in our hands; a burden when it enters our heart. Islam does not forbid riches — Uthman and Abdurrahman ibn Awf were very wealthy. What it forbids is wealth ruling the heart. Be the owner of your wealth, not of your heart. If you can give, you are the owner; if you cannot, you have been owned. True freedom is being able to say "what if I lose it?"; for your real attachment must be to the Giver.',
    verse: { text: '"Your wealth and your children are only a trial, and with Allah is a great reward."' },
  },
  'kartal': {
    title: 'The Eagle Among Chickens',
    paragraphs: [
      'A farmer placed an eaglet he had found in the mountains among the chickens in his coop. The young eagle grew up with the chickens. Like them it pecked feed from the ground, like them it clucked, like them it flapped briefly and rose a metre before landing again. It thought it was a chicken.',
      'Years passed. One day a magnificent bird glided across the sky. Without ever beating its wings, it hung as if suspended on the wind. It circled in splendour, rose, and vanished. The old eagle lifted its head and gazed in admiration: "What a magnificent bird! If only I could fly like that."',
      'The chicken beside it pecked feed indifferently: "Forget it, that is an eagle, the king of the skies. We are chickens, of the ground. And you are one of us." The eagle sighed, lowered its head, and went back to gathering feed.',
      'And that eagle, though created as king of the skies, lived its whole life like a chicken and died so. Because no one had told it who it was — and it had never asked.',
    ],
    question: 'What kept the eagle on the ground?',
    choices: [
      'Not its wings, but not knowing itself',
      'That it genuinely could not fly',
      'That the farmer had tied it',
    ],
    lesson: 'Though man was created "the most honoured" on earth (al-Isra 70), he often lives by the limits the surrounding "chickens" set for him: "You cannot, you do not deserve this, this is just how you are." Yet in every person a wing to rise to the heavens is hidden — faith, reason, will. What keeps you on the ground is not your lack of ability but your forgetting who you are. When your Creator made you an eagle, close your ears to every voice that convinces you that you are a chicken. To fly, one must first say "I can fly."',
    verse: { text: '"And We have certainly honoured the children of Adam."' },
  },
  'iki-tohum': {
    title: 'Two Seeds in the Soil',
    paragraphs: [
      'Beneath fertile soil, two seeds lay side by side. Spring came, the earth warmed. The first seed stirred with excitement: "I want to grow! I want to send my roots deep, stretch my shoot up toward the sun. I want to split the soil and come out, to bloom!" And so it did. It strained, it struggled, it pierced the soil, it reached the light.',
      'The second seed, however, was afraid: "If I send out my roots, I do not know what I will hit below. If I stretch my shoot up, my tender stem might be hurt. If I split the soil, I will put my buds and flowers at risk. Snails might eat me, children might pluck me. Better to wait until it is safe."',
      'And it waited. In the dark, under the safe soil, motionless, it waited.',
      'A few weeks later, a hen scratching the earth found that second seed waiting there without stirring, and swallowed it with a peck. Meanwhile, above, the first seed was now a flower reaching toward the sun.',
    ],
    question: 'What did the place the second seed thought was "safe" become?',
    choices: [
      'That whoever fears to grow perishes where he stands',
      'That patience always pays off',
      'That the soil is dangerous',
    ],
    lesson: 'Sometimes the greatest risk is taking no risk at all. Waiting motionless to "stay safe" often keeps us from growing. Faith is like this too; like a seed it asks us to split open and sprout, to risk mistakes, falls, and rising again. Allah loves the one who strives: "Man shall have nothing but what he strived for." Waiting in the darkness of the comfort zone looks safe — but there no flower blooms, no sun is seen. Reliance on Allah (tawakkul) is not motionless waiting; it is sowing and leaving the result to Allah.',
    verse: { text: '"...Allah does not change the condition of a people until they change what is in themselves."' },
  },
  'fil': {
    title: 'The Elephant Tied by a Rope',
    paragraphs: [
      'At a fair, a traveller saw huge elephants tied by a small rope to a thin stake. There was no chain, no cage. Those enormous animals could, if they wished, snap the rope in one move and be free. But they did not even stir.',
      'Astonished, he asked the elephant keeper: "How do such powerful animals stay put with this thin rope?" The keeper smiled: "We tie them with the same rope when they are calves, very small and weak. Then, no matter how hard they try, they cannot break it. In time they come to believe, \'I cannot break this rope.\'"',
      '"The elephant grows, becomes huge, its strength multiplies many times over. But that belief stays in its mind. It never even tries to break the rope anymore. Because in its mind it is still that weak calf."',
      'The traveller watched the elephants for a long time. It was not the rope that bound them; it was a belief of "I cannot" they had accepted years ago.',
    ],
    question: 'What was the real tie that held the elephant in place?',
    choices: [
      'A belief of "I cannot" formed in the past',
      'That the rope was genuinely strong',
      'That it feared the keeper',
    ],
    lesson: 'Most of us live tied by the rope of a failure we experienced years ago: "I just cannot do it, I cannot change, I will never amount to anything." That rope may once have been real — but you grew, you got stronger, you changed; only your belief stayed small. Allah always keeps the door of repentance open; to say "I was like this in the past" does not mean "I will always stay this way." It is worth testing the rope that binds you just once — often it snaps more easily than you thought. Not despairing of mercy begins with breaking that rope.',
    verse: { text: '"...Do not despair of the mercy of Allah. Indeed, Allah forgives all sins."' },
  },
  'kuyu': {
    title: 'The Traveller in the Well',
    paragraphs: [
      'As a traveller walked through a barren desert, he noticed a lion coming up behind him. There was nowhere to flee; a little ahead he saw an old well and threw himself into it. As he fell, he caught a branch dangling from the mouth of the well and hung there in the air.',
      'He looked down: at the bottom of the well a huge snake waited with its mouth open. He looked up: the lion was prowling at the well\'s mouth. And then he heard a sound — two mice, one white and one black, were gnawing at the root of the branch he clung to.',
      'Just then his eye fell on a small beehive on the wall of the well. Honey was dripping from it. The traveller reached out, took some honey on his finger and tasted it. The honey was so sweet that — for a moment — he forgot the lion, the snake, and the mice gnawing the branch.',
      'The people of wisdom who tell this parable say: that well is the world. The lion is death, the snake is the grave. The branch is one\'s lifespan. Those two mice, one day and one night, are time ceaselessly gnawing the life you cling to.',
      'And the honey? The honey is the taste of the world: wealth, rank, pleasure... It is sweet, and there is no fault in its being sweet — the fault is in a single drop of honey making you forget the branch, the mice, and the end of the journey.',
      'Does the wise traveller not taste the honey? He tastes it. But he tastes it never forgetting that the branch is being gnawed; and he saves his real strength for seeking the way out of the well.',
    ],
    checkpoints: [
      {
        after: 2,
        q: 'Face to face with death, a single drop of honey made him forget everything. What might this honey represent?',
        choices: ["The world's fleeting pleasures", 'True salvation', 'A reward found by chance'],
        insight: 'Here is the secret of the parable: the danger never disappeared — it was only forgotten. The taste of the world is like this too; it does not remove the danger, it only veils it.',
      },
      {
        after: 3,
        q: 'Two mice, one white and one black, gnaw the branch. What do this pair make you think of?',
        choices: ['Day and night — that is, passing time', 'Good and evil', 'Two different enemies'],
        insight: 'Every morning and every evening, one more fibre is worn from the branch of life. You cannot stop the mice; but while you hang from the branch, what you do is entirely in your hands.',
      },
    ],
    question: 'The last line ends, "the wise traveller tastes the honey, but..." Where is the balance struck?',
    choices: [
      'Not in renouncing the world, but in not forgetting the journey while tasting it',
      'In never tasting the honey',
      'In building a permanent settlement in the well',
    ],
    lesson: 'Islam does not forbid the world; it forbids being "deceived" by it. A blessing is one thing, heedlessness another. The same honey, tasted with gratitude, becomes a blessing; if it makes you forget the journey, it becomes a trap. The practical way to remember this parable is: while enjoying something, ask yourself — "Is this pleasure reminding me of my journey, or making me forget it?" The answer tells you which side the honey is on.',
    verse: { text: '"Know that the life of this world is only play, amusement, adornment, mutual boasting, and rivalry in wealth and children..."' },
  },
  'yasli-fidan': {
    title: 'They Planted, We Ate',
    paragraphs: [
      'A ruler, passing along the road with his retinue, saw a ninety-year-old man planting a walnut sapling in the soil. He stopped his horse; the scene struck him as strange. For the walnut tree bears fruit late — perhaps twenty years, perhaps more.',
      '"Old man," said the ruler, "does one plant walnuts at this age? Do you think you will eat the fruit of this tree?"',
      'The old man straightened up, wiped the sweat from his brow, and smiled: "My sultan, until today we ate from trees that were planted. Those before us planted, and we ate. Now we plant, so that those after us may eat."',
      'The answer pleased the ruler greatly; he said "Well done!" and gave the old man a purse of gold. As the old man took the purse, his eyes lit up: "Do you see, my sultan? Everyone\'s sapling bears fruit in twenty years — mine bore fruit as it was being planted." The ruler, charmed by this grace, gave another purse and rode off laughing.',
      'Perhaps the old man never saw the fruit of that sapling. But today everyone who reads this parable sits in the shade of the real tree the old man planted — a sentence of wisdom.',
    ],
    checkpoints: [
      {
        after: 1,
        q: 'The ruler\'s question is the question of a voice within all of us: "Why do it if you will not see the benefit?" What would you answer?',
        choices: ['Benefit is not only "my seeing it"; every good sown reaches someone', 'He is right, wasted effort at this age', 'Maybe a miracle will make it bear fruit early'],
        insight: 'If you arrived at the same door before reading the old man\'s answer, then half the parable was already sown in your heart.',
      },
      {
        after: 3,
        q: '"Mine bore fruit as it was being planted" — what is the second wisdom in these words?',
        choices: ['The blessing of a sincere deed comes from unexpected doors', 'Money is always the reward of effort', 'Rulers should be generous'],
        insight: 'The old man did not plant for gold; but when the intention was sound, the worldly gain followed too. Blessing is called not by calculation, but by sincerity.',
      },
    ],
    question: 'According to the parable, what does "ongoing charity" (sadaqa jariya) most resemble?',
    choices: [
      'Planting a tree whose fruit others will eat',
      'A single large donation',
      'A monument that carries your name',
    ],
    lesson: 'Life is short, but the life of a deed can be long. A piece of knowledge you taught, a tree you planted, a child you raised, a beneficial line you wrote — all keep flowing into your account after you are gone. Beside the question "What did I gather today?" place another: "What did I sow today for those who come after me?" Every deed that answers this question makes death smaller; for it keeps the record of deeds open.',
    verse: { text: '"Indeed, it is We who bring the dead to life, and We record what they have done and the traces they left behind."' },
  },
  'catlak-testi': {
    title: 'The Cracked Pot',
    paragraphs: [
      'A water-carrier filled two large pots from the stream each morning on the pole across his shoulders and carried them to his master\'s house. One of the pots was flawless; it delivered all the water it carried. The other was cracked; it leaked along the way and arrived half-full.',
      'This went on every day for two years. The flawless pot was content with its state. The cracked pot, however, was full of shame. One day it could bear it no longer and called out to the carrier: "I am ashamed of myself. I leak water through my crack, half your effort goes to waste. Replace me now."',
      'The carrier smiled: "Tomorrow, on the way back, I want you to look at the side of the road."',
      'The next day the cracked pot looked at the roadside and saw: along its own side of the path colourful flowers had bloomed — while on the other side there was nothing. The carrier spoke: "I noticed your crack on the very first day. And I sowed flower seeds on your side. For two years, every day, without knowing it, you watered them. With those flowers I adorned my master\'s table. With the very thing you called a \'flaw,\' you did what no one else could."',
    ],
    checkpoints: [
      {
        after: 1,
        q: 'The cracked pot sees itself as "half." What is the real lack in this view?',
        choices: ['Not seeing the whole picture — not knowing where the leaked water went', 'Not trying hard enough', 'Not knowing how to hide its flaw'],
        insight: 'The harshest judgements about ourselves are often made by looking at only one corner of the picture. We do not see the soil where the leaking water falls.',
      },
      {
        after: 3,
        q: 'The carrier did not repair the crack; he sowed seeds along its path. What does this tell you?',
        choices: ['Wisdom is not to deny a flaw, but to find the way that turns it into good', 'Flaws should never be corrected', 'The carrier was being lazy'],
        insight: 'Allah created His servants with different "cracks." One crack blooms flowers through patience, another through humility, another through understanding someone else\'s pain.',
      },
    ],
    question: 'After this parable, how should you look at your own "crack"?',
    choices: [
      '"Which flower might this flaw of mine be watering?" I should ask',
      'I should hold back until I am flawless',
      'I should show my flaw to no one',
    ],
    lesson: 'The thing you are ashamed of is not the end of the story; often it is the story\'s hidden hero. If the hardship you lived through made you someone who understands others\' pain, then that crack has bloomed flowers. This is not to abandon the effort of correcting faults — it is to not hate yourself while trying to correct yourself. In Allah\'s decree there is no waste; even your "if only"s, poured onto the right soil, become a garden.',
    verse: { text: '"...Perhaps you dislike a thing and it is good for you; and perhaps you love a thing and it is bad for you. Allah knows, and you do not know."' },
  },
  'tuz': {
    title: 'A Handful of Salt',
    paragraphs: [
      'A young man came to an old sage. He was weary and hurt: "The troubles of life have crushed me. The same worries, the same pains... I cannot carry it anymore."',
      'The sage handed him a handful of salt: "Put this in this glass and drink from its water." The young man drank and grimaced: "Like poison. It cannot be drunk."',
      'This time the sage led him to the clear lake behind the house. He had him throw the same handful of salt into the lake: "Now drink from the lake." The young man drank with his cupped hand. "How is it?" asked the sage. "Sweet," said the young man, "there is not even a taste of salt."',
      'The sage sat beside him: "My son, the pains of life are a handful of salt; no more, no less. Everyone is given the same handful. But the taste of the pain depends on the size of the vessel you put it in. If you are a glass, a handful of salt poisons you. If you are a lake, the same salt is lost within."',
      '"So do not deny your pain; enlarge your vessel. Let your heart widen: with knowledge, with gratitude, with benefit to people, with remembrance of Allah... Stop being a glass, become a lake."',
    ],
    checkpoints: [
      {
        after: 1,
        q: 'On hearing the complaint, the sage first had him drink salt water. Why begin with experience rather than advice?',
        choices: ['It is not understood without tasting; wisdom is taught by being lived', 'He wanted to punish the young man', 'He had no words of advice'],
        insight: 'The road of a lesson that sinks into the heart sometimes passes not through the tongue but through the palate. The most lasting knowledge is knowledge sealed by experience.',
      },
      {
        after: 3,
        q: '"Everyone is given the same handful" — do you think this is true?',
        choices: ['Though troubles differ in shape, no servant is without trial; the difference is the width of the vessel', 'No, some people have no troubles at all', 'True, but enlarging the vessel is impossible'],
        insight: 'Everyone who looks "trouble-free" from afar also has salt in their glass. We cannot see from outside who is a lake and who is a glass.',
      },
    ],
    question: 'How does one enlarge the vessel, concretely?',
    choices: [
      'By giving the heart breadth through knowledge, gratitude, benefit to people and remembrance',
      'By ignoring the pain',
      'By not telling others one\'s troubles',
    ],
    lesson: 'You cannot erase pain; but you can enlarge the life in which the pain dissolves. Prayer is the digging of a lake; knowledge is the lake\'s depth; the hand you extend to another is a new spring flowing into the lake. The trouble stays the same trouble, but you do not stay the same you — and the same salt loses its taste in the growing lake. To ask hardship "why me?" is the question of the glass; to ask "how do I grow through this?" is the question of the lake.',
    verse: { text: '"Indeed, with hardship comes ease. Indeed, with hardship comes ease."' },
  },
  'uc-soru': {
    title: 'Three Questions',
    paragraphs: [
      'A ruler believed that if he knew the answers to three questions, he would never err: Which is the most important time? Who is the most important person? What is the most important deed? The scholars of his land gave differing answers; none satisfied him. At last, hearing of the wisdom of an ascetic living in the mountains, he went to him in disguise.',
      'He found the ascetic digging his garden. He asked his questions; the ascetic gave no answer and kept digging. As the old man tired, the ruler took the spade and worked in his place. Hours passed, and the questions were still unanswered.',
      'Just as he was about to leave, a wounded man came out of the forest; blood was flowing from his belly. The ruler laid him down, bound his wound with his own shirt, carried water, and stayed by his side through the night. In the morning the wounded man opened his eyes and whispered: "Forgive me. I was your enemy; you had my brother executed. Today I lay in ambush to kill you on your way back. When your guards wounded me I fled — and you, my enemy, saved me. From now on let my life be spent in your service."',
      'The ruler turned to the ascetic in astonishment: "I still have not received the answers to my questions." The ascetic smiled: "You lived your answers yesterday. Had you not taken pity and taken the spade, you would have fallen into the ambush on your way back: so the most important time was that moment — now. The most important person was the one beside you. And the most important deed was doing him good."',
      '"Never forget this: your only real time is now, for it is all you hold. The most important person is the one before you now, for you cannot know if you will meet again. The most important deed is goodness, for man was sent for it."',
    ],
    checkpoints: [
      {
        after: 1,
        q: 'The ascetic gave no answer and kept digging. What might this silence be saying?',
        choices: ['That the answer would be given not in words but by being lived', 'That he did not hear the questions', 'That he did not know the answer'],
        insight: 'Some questions are answered not by words leaving the mouth, but by events passing through one\'s life. The ascetic put the ruler not through a lesson, but through a test.',
      },
      {
        after: 2,
        q: 'The ruler saved his enemy\'s life without knowing who he was. What is the subtlety here?',
        choices: ['Goodness is not done by calculation; it is done without asking "who" the other is', 'By chance he met the right person', 'He would have saved him even knowing he was an enemy, it made no difference'],
        insight: 'The ruler did not ask "what will this man provide me?" The blessing of goodness is hidden in the moment no reckoning of return is made — the ambush was undone by that very absence of calculation.',
      },
      {
        after: 3,
        q: 'Turn the three answers to your own life: "the most important time is now" makes you give up what, most of all?',
        choices: ['The postponement of "I will do it later"', 'Making plans', 'Learning from the past'],
        insight: 'For repentance, for prayer, for mending a heart, we always wait for a "convenient tomorrow." Yet the only time we surely hold is this breath.',
      },
    ],
    question: 'If the three answers of this parable were gathered into one sentence, which would it be?',
    choices: [
      '"Now, to the one beside you, do good" — the rest is Allah\'s decree',
      '"Plan the future, choose the right people, do great works"',
      '"Study the past, know important people, leave a lasting work"',
    ],
    lesson: 'Man always values the distant: future plans, unreachable people, great projects... Yet the religion sanctifies the near: the appointed prayer is the worship of "now," parents and neighbours of "the one beside you," charity and a smiling face of "goodness." Hastening to do good is from this too: tomorrow is in neither your hands nor the other person\'s. Every good you postpone today is a letter with no guarantee of reaching its owner.',
    verse: { text: '"Race toward forgiveness from your Lord and a Garden as wide as the heavens and the earth..."' },
  },
  'kandil': {
    title: "The Blind Man's Lantern",
    paragraphs: [
      'At midnight, a traveller made his way along a dark village road. He saw a man approaching with a lantern in his hand. As he drew near he realized: the man carrying the lantern was blind.',
      'The traveller could not help asking: "But you cannot see... What use is this lantern to you?"',
      'The blind man stopped and answered calmly: "I do not carry this lantern for myself. For me night and day are the same, true. But thanks to this lantern, those who can see notice me in the dark and do not bump into me. What is more, their path is lit by my lantern too."',
      '"In other words," he said with a smile, "the benefit of light is not only that its bearer sees. Sometimes a person carries, for others, a light he himself cannot see."',
      'As the traveller went on his way he thought: how many people leave at home the light in their hand — their knowledge, their experience, their smiling face — saying "it is of no use to me"?',
    ],
    checkpoints: [
      {
        after: 1,
        q: 'The traveller\'s question is quite logical: "What does one who cannot see need a lantern for?" What does this logic overlook?',
        choices: ['That benefit is imagined to be only "benefit to oneself"', 'That the lantern is expensive', 'That the blind man knows the road by heart'],
        insight: 'Our mind often reckons "what benefit is this to me?" The blind man\'s reckoning was different: "Who benefits from my light?"',
      },
      {
        after: 3,
        q: '"A person carries, for others, a light he himself cannot see." Do you carry such a light?',
        choices: ['I do — everything I know, have lived, and can offer as good is a lantern', 'No — carrying light is the work of scholars', 'To carry light one must first be flawless'],
        insight: 'A piece of religious knowledge, an experience, an apology, a smile... What seems ordinary to you may be a guiding light for someone left in the dark.',
      },
    ],
    question: "The blind man's lantern did two things at once. Which two?",
    choices: [
      'It protected him and lit others\' way — goodness flows both directions',
      'It warmed and it lit',
      'It guided and it decorated',
    ],
    lesson: 'Goodness is not a one-way gift; it also protects the one who carries it. The giver of charity blesses his wealth, the speaker of a kind word his heart, the teacher of knowledge his knowledge. The man who said "but I cannot see" was in fact seeing more than anyone — for he reckoned benefit not from his own window, but from the window of the whole community. The lantern in your hand may be small; if the darkness is great, the value of the light rises — not its smallness.',
    verse: { text: '"...Cooperate in righteousness and piety, and do not cooperate in sin and aggression..."' },
  },
  'bir-yudum-su': {
    title: 'A Sip of Water',
    paragraphs: [
      'It is related that the man of wisdom Ibn al-Sammak once entered the assembly of the caliph. The caliph was just about to drink water; the cup was in his hand, raised to his lips. Ibn al-Sammak said, "O commander of the believers, I have a question," "answer it before you drink that cup."',
      '"Ask," said the caliph. The sage asked: "If you were stranded in the desert, dying of thirst, and this sip of water were not given to you — what would you give to obtain it?" The caliph thought: "I would give half my kingdom." "Then drink," said the sage. The caliph drank.',
      'When the water was gone, the second question came: "And if the water you drank could not leave your body, and you were going to fall ill and die — what would you give for it to pass?" The caliph fell silent, then confessed: "My entire kingdom."',
      'Ibn al-Sammak nodded: "O commander of the believers! A dominion whose worth equals a sip of water and its passing from the body is not a thing for which the Hereafter should be sold."',
    ],
    question: 'By what did the sage\'s two questions measure the true worth of the kingdom?',
    choices: [
      "By a sip of water at a person's most helpless moment",
      'By the amount of gold in the treasury',
      'By the size of the army',
    ],
    lesson: 'The value of what we have shows itself not in the marketplace but in the moment of helplessness. A sip of water, a breath of air, a night\'s sleep... these are priceless blessings, yet because we imagine them "cost-free," we do not even write them on our list of thanks. The parable teaches two things: first, before growing the wealth in your hand, see the wealth in your body. Second, no worldly thing — even a kingdom — can justify the arrogance of a person who is in need of a single sip of water.',
    verse: { text: '"And He gave you from all you asked of Him. If you tried to count the favours of Allah, you could not enumerate them..."' },
  },
  'iki-kus': {
    title: 'Two Birds',
    paragraphs: [
      'It is related that a dervish wished to learn reliance on Allah: "Birds do not chase after provision; Allah feeds them. I too will withdraw to a corner and rely on Allah." He went to a deserted place, sat, and began to wait.',
      'After a while his eye fell on a bird: its wing was broken, it could not fly. As he thought "how will this bird eat now?", another bird arrived; it dropped the food it carried in its beak into the mouth of the broken-winged bird. The dervish rejoiced: "There! Allah sends provision even to the one who sits. I am on the right path."',
      'In those days his road led to a sage, and he told him what he had seen. The sage smiled: "My son, there were two birds in the scene. Why did you take the broken-winged bird as your example? Why did you not choose to be the bird that carried the provision?"',
      '"The giving hand is better than the receiving hand. Reliance on Allah is not living as if your wing were broken while it is sound; it is beating your wing to the utmost and leaving the result to Allah. That bird carrying food to the broken-winged one was also relying on Allah — and in the finest way."',
    ],
    question: "According to the sage, what was the dervish's mistake?",
    choices: [
      'Taking the weaker of the two birds as his example',
      'Wasting time watching birds',
      'Going to a deserted place',
    ],
    lesson: 'Two lessons come from the same scene: one says "sit, and it will come if you wait"; the other says "get up, and you too carry to someone." The Prophet ﷺ said, "The upper (giving) hand is better than the lower (receiving) hand" (Bukhari, Zakat 18). True reliance on Allah is not passivity; it is tying the camel and trusting Allah, sowing the seed and awaiting the mercy, beating the wing and leaving the wind to Him. Be the carrying bird as long as you have strength — on the day you cannot carry, the One who sends a carrier to you is Him anyway.',
    verse: { text: '"...And whoever relies upon Allah — then He is sufficient for him..."' },
  },
};

// ── Categories ──
export const STORY_CATEGORIES_EN = {
  'derin':  'Deep Wisdom · Layered',
  'ahlak':  'Character & Ethics',
  'sabir':  'Patience & Gratitude',
  'hikmet': 'Wisdom & Insight',
};

// ── Gem names ──
export const STORY_GEMS_EN = {
  'kor-cocuk': 'Gratitude Gem', 'marangoz': 'Sincerity Gem', 'tohum': 'Honesty Gem',
  'iki-deniz': 'Generosity Gem', 'civi': 'Tongue Gem', 'kelebek': 'Patience Gem',
  'balikci': 'Contentment Gem', 'bin-deve': 'Humility Gem', 'kartal': 'Fitrah Gem',
  'iki-tohum': 'Tawakkul Gem', 'fil': 'Resolve Gem', 'kuyu': 'Insight Seal',
  'yasli-fidan': 'Legacy Seal', 'catlak-testi': 'Contentment Seal', 'tuz': 'Breadth Seal',
  'uc-soru': 'Now Seal', 'kandil': 'Light Seal', 'bir-yudum-su': 'Blessing Gem',
  'iki-kus': 'Effort Gem',
};

// ── "Carry it into Life" tasks ──
export const STORY_APPLY_EN = {
  'kor-cocuk': 'Today write 3 blessings you have but never think about, and say "alhamdulillah" inwardly for each.',
  'marangoz': 'Today do your most ordinary task with care, saying "this is a brick of my house in the Hereafter."',
  'tohum': 'Today choose the hard road of honesty in even a small matter; leave the easy escape.',
  'iki-deniz': 'Today give something expecting nothing back: a piece of knowledge, a help, a smile.',
  'civi': 'Today, as a hurtful word is about to leave your mouth, pause 3 seconds and do not drive that nail.',
  'kelebek': 'In a task you find hard today, instead of "if only it were easy" say "this is strengthening me" and go on.',
  'balikci': 'Today write down something you said you "need more of"; do you truly need it, or do you need contentment — answer honestly.',
  'bin-deve': 'Today, even when you are right in an argument, try once to say "you are right, I was mistaken."',
  'kartal': 'Today identify a habit that drags you down and stay away from it for one day.',
  'iki-tohum': 'Take the first small step today of that task you have postponed; leave the result to Allah.',
  'fil': 'Try once today something you said "I cannot do" — just once.',
  'kuyu': 'Today, in a moment of pleasure (a meal, a show, the phone), pause once and ask: "Am I remembering my journey?"',
  'yasli-fidan': 'Today sow something that will outlast you: teach someone something useful, or make a small contribution to a lasting good.',
  'catlak-testi': 'Write a "flaw" you are ashamed of, and add beside it: "Which flower might this crack be watering?"',
  'tuz': 'Today, to what troubles you, ask "how do I grow through this?" instead of "why me?" and write a one-sentence answer.',
  'uc-soru': 'Do a good deed you have postponed (a message, a visit, an apology, a charity) today — now.',
  'kandil': 'Share something useful you know with one person today; do not leave your lantern at home.',
  'bir-yudum-su': 'Today, while drinking water, pause once and say "alhamdulillah for this sip" — the sip whose price is a kingdom.',
  'iki-kus': 'Today be the "carrying bird": deliver a concrete help, however small, to someone in need.',
};

export default STORIES_EN;
