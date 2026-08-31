/* ============================================================
   courses.js — 分级课程数据体系 (英语 / 日语 / 韩语)
   等级: A1 入门 · A2 初级 · B1 中级 · B2 中高级 · C1 高级
   每课包含: vocab(单词) grammar(语法) speak(口语) listen(听力)
   ============================================================ */
(function (global) {
  "use strict";

  const LANGUAGES = [
    { code: "en", name: "英语", native: "English", flag: "EN", color: "en" },
    { code: "ja", name: "日语", native: "日本語", flag: "JP", color: "jp" },
    { code: "ko", name: "韩语", native: "한국어", flag: "KO", color: "ko" }
  ];

  const LEVELS = [
    { code: "A1", name: "入门", name_en: "Beginner", desc: "掌握基础问候与日常表达" },
    { code: "A2", name: "初级", name_en: "Elementary", desc: "能进行简单的日常交流" },
    { code: "B1", name: "中级", name_en: "Intermediate", desc: "能就熟悉话题清晰表达" },
    { code: "B2", name: "中高级", name_en: "Upper-Int.", desc: "能与母语者流畅互动" },
    { code: "C1", name: "高级", name_en: "Advanced", desc: "灵活高效地运用语言" }
  ];

  // ---------- 英语课程 ----------
  const EN = {
    A1: {
      title: "英语 · 入门",
      lessons: [
        {
          id: "en-A1-1", title: "Greetings 问候", desc: "Hello / Hi / Goodbye",
          vocab: [
            { word: "Hello", roman: "/həˈloʊ/", meaning: "你好", example: "Hello, how are you?" },
            { word: "Goodbye", roman: "/ˌɡʊdˈbaɪ/", meaning: "再见", example: "Goodbye, see you tomorrow." },
            { word: "Thank you", roman: "/ˈθæŋk juː/", meaning: "谢谢", example: "Thank you very much." },
            { word: "Please", roman: "/pliːz/", meaning: "请", example: "Please sit down." },
            { word: "Sorry", roman: "/ˈsɒri/", meaning: "对不起", example: "Sorry, I'm late." }
          ],
          grammar: [
            { q: "—Hello! —____ are you? —I'm fine, thanks.", choices: ["What", "How", "Who", "Where"], answer: 1, explain: "问候对方近况用 How are you?" },
            { q: "—Thank you. —You're ____.", choices: ["ok", "welcome", "fine", "good"], answer: 1, explain: "回应感谢用 You're welcome." },
            { q: "—Goodbye! —See you ____.", choices: ["today", "tomorrow", "now", "here"], answer: 1, explain: "See you tomorrow 明天见。" }
          ],
          speak: [
            { word: "Hello", roman: "/həˈloʊ/", meaning: "你好" },
            { word: "Thank you", roman: "/ˈθæŋk juː/", meaning: "谢谢" },
            { word: "Goodbye", roman: "/ˌɡʊdˈbaɪ/", meaning: "再见" }
          ],
          listen: [
            { audio: "Hello, nice to meet you.", question: "说话者想表达什么？", choices: ["问候", "告别", "道歉", "感谢"], answer: 0 },
            { audio: "Thank you for your help.", question: "这句话是什么意思？", choices: ["请求帮助", "表达感谢", "介绍自己", "询问时间"], answer: 1 },
            { audio: "See you tomorrow. Goodbye!", question: "说话者要做什么？", choices: ["开始", "告别", "道歉", "同意"], answer: 1 }
          ]
        },
        {
          id: "en-A1-2", title: "Numbers 数字", desc: "1–20 与年龄",
          vocab: [
            { word: "one", roman: "/wʌn/", meaning: "一", example: "I have one book." },
            { word: "two", roman: "/tuː/", meaning: "二", example: "Two cats are here." },
            { word: "ten", roman: "/ten/", meaning: "十", example: "Ten students came." },
            { word: "year", roman: "/jɪr/", meaning: "年/岁", example: "I am ten years old." },
            { word: "old", roman: "/oʊld/", meaning: "…岁的", example: "How old are you?" }
          ],
          grammar: [
            { q: "How old ____ you? —I'm ten.", choices: ["am", "is", "are", "be"], answer: 2, explain: "对 you 提问用 are。" },
            { q: "I am ten ____ old.", choices: ["year", "years", "year's", "years'"], answer: 1, explain: "复数 years old 表年龄。" },
            { q: "Two ____ three is five.", choices: ["and", "or", "but", "so"], answer: 0, explain: "and 表相加。" }
          ],
          speak: [
            { word: "one", roman: "/wʌn/", meaning: "一" },
            { word: "ten", roman: "/ten/", meaning: "十" },
            { word: "How old are you?", roman: "", meaning: "你几岁了？" }
          ],
          listen: [
            { audio: "I am twelve years old.", question: "说话者几岁？", choices: ["10", "11", "12", "20"], answer: 2 },
            { audio: "There are five cats.", question: "有几只猫？", choices: ["3", "4", "5", "6"], answer: 2 },
            { audio: "How old are you?", question: "他在问什么？", choices: ["姓名", "年龄", "时间", "地点"], answer: 1 }
          ]
        },
        {
          id: "en-A1-3", title: "Family 家庭", desc: "家庭成员称谓",
          vocab: [
            { word: "father", roman: "/ˈfɑːðər/", meaning: "父亲", example: "My father is a teacher." },
            { word: "mother", roman: "/ˈmʌðər/", meaning: "母亲", example: "My mother cooks well." },
            { word: "brother", roman: "/ˈbrʌðər/", meaning: "兄弟", example: "I have one brother." },
            { word: "sister", roman: "/ˈsɪstər/", meaning: "姐妹", example: "Her sister is young." },
            { word: "family", roman: "/ˈfæməli/", meaning: "家庭", example: "I love my family." }
          ],
          grammar: [
            { q: "This is ____ mother. She is kind.", choices: ["I", "my", "me", "mine"], answer: 1, explain: "形容词性物主代词 my。" },
            { q: "I have one brother ____ one sister.", choices: ["or", "and", "but", "so"], answer: 1, explain: "and 连接并列项。" },
            { q: "____ is your father? —He is fine.", choices: ["What", "How", "Where", "Who"], answer: 1, explain: "问状态用 How。" }
          ],
          speak: [
            { word: "father", roman: "/ˈfɑːðər/", meaning: "父亲" },
            { word: "mother", roman: "/ˈmʌðər/", meaning: "母亲" },
            { word: "family", roman: "/ˈfæməli/", meaning: "家庭" }
          ],
          listen: [
            { audio: "This is my mother.", question: "在介绍谁？", choices: ["父亲", "母亲", "兄弟", "姐妹"], answer: 1 },
            { audio: "I have a younger sister.", question: "说话者有？", choices: ["哥哥", "弟弟", "妹妹", "父亲"], answer: 2 },
            { audio: "My father is a doctor.", question: "父亲的职业是？", choices: ["老师", "医生", "学生", "厨师"], answer: 1 }
          ]
        }
      ]
    },
    A2: {
      title: "英语 · 初级",
      lessons: [
        {
          id: "en-A2-1", title: "Daily Routine 日常作息", desc: "一般现在时描述日常",
          vocab: [
            { word: "morning", roman: "/ˈmɔːrnɪŋ/", meaning: "早晨", example: "I wake up in the morning." },
            { word: "breakfast", roman: "/ˈbrekfəst/", meaning: "早餐", example: "I have breakfast at seven." },
            { word: "work", roman: "/wɜːrk/", meaning: "工作", example: "She works in a bank." },
            { word: "evening", roman: "/ˈiːvnɪŋ/", meaning: "傍晚", example: "We relax in the evening." },
            { word: "usually", roman: "/ˈjuːʒuəli/", meaning: "通常", example: "I usually go by bus." }
          ],
          grammar: [
            { q: "He ____ to school by bus every day.", choices: ["go", "goes", "going", "went"], answer: 1, explain: "三单现在时加 -es。" },
            { q: "I usually ____ up at 6 a.m.", choices: ["wake", "wakes", "waking", "woke"], answer: 0, explain: "I 用动词原形。" },
            { q: "____ she work here? —Yes, she does.", choices: ["Do", "Does", "Is", "Are"], answer: 1, explain: "she 用 Does 提问。" }
          ],
          speak: [
            { word: "I usually wake up early.", roman: "", meaning: "我通常早起" },
            { word: "She works in a bank.", roman: "", meaning: "她在银行工作" },
            { word: "What do you do?", roman: "", meaning: "你是做什么的？" }
          ],
          listen: [
            { audio: "I have breakfast at seven every morning.", question: "他几点吃早餐？", choices: ["6点", "7点", "8点", "9点"], answer: 1 },
            { audio: "She usually goes to work by bus.", question: "她怎么上班？", choices: ["步行", "公交", "开车", "骑车"], answer: 1 },
            { audio: "We relax in the evening.", question: "他们什么时候放松？", choices: ["早上", "中午", "傍晚", "深夜"], answer: 2 }
          ]
        },
        {
          id: "en-A2-2", title: "Shopping 购物", desc: "购物场景对话",
          vocab: [
            { word: "shop", roman: "/ʃɒp/", meaning: "商店", example: "The shop is open." },
            { word: "price", roman: "/praɪs/", meaning: "价格", example: "What's the price?" },
            { word: "expensive", roman: "/ɪkˈspensɪv/", meaning: "昂贵的", example: "It's too expensive." },
            { word: "cheap", roman: "/tʃiːp/", meaning: "便宜的", example: "This bag is cheap." },
            { word: "pay", roman: "/peɪ/", meaning: "支付", example: "I'll pay by card." }
          ],
          grammar: [
            { q: "How ____ is this shirt? —Twenty dollars.", choices: ["many", "much", "old", "long"], answer: 1, explain: "问价格用 How much。" },
            { q: "This bag is ____ expensive for me.", choices: ["too", "to", "two", "very much"], answer: 0, explain: "too 表过分。" },
            { q: "I'll pay ____ cash.", choices: ["in", "by", "with", "on"], answer: 1, explain: "by cash/by card 表支付方式。" }
          ],
          speak: [
            { word: "How much is it?", roman: "", meaning: "多少钱？" },
            { word: "It's too expensive.", roman: "", meaning: "太贵了" },
            { word: "I'll pay by card.", roman: "", meaning: "我刷卡支付" }
          ],
          listen: [
            { audio: "How much is this jacket?", question: "他在问什么？", choices: ["颜色", "价格", "尺码", "材质"], answer: 1 },
            { audio: "It's fifty dollars, very cheap.", question: "商品的特点？", choices: ["贵", "便宜", "破损", "缺货"], answer: 1 },
            { audio: "I'll pay by credit card.", question: "支付方式？", choices: ["现金", "信用卡", "支票", "转账"], answer: 1 }
          ]
        }
      ]
    },
    B1: {
      title: "英语 · 中级",
      lessons: [
        {
          id: "en-B1-1", title: "Travel 旅行", desc: "现在完成时分享经历",
          vocab: [
            { word: "abroad", roman: "/əˈbrɔːd/", meaning: "在国外", example: "I've never been abroad." },
            { word: "experience", roman: "/ɪkˈspɪriəns/", meaning: "经历/经验", example: "It was a great experience." },
            { word: "flight", roman: "/flaɪt/", meaning: "航班", example: "The flight was delayed." },
            { word: "passport", roman: "/ˈpæspɔːrt/", meaning: "护照", example: "Don't forget your passport." },
            { word: "destination", roman: "/ˌdestɪˈneɪʃn/", meaning: "目的地", example: "Kyoto is our destination." }
          ],
          grammar: [
            { q: "I ____ been to Japan three times.", choices: ["have", "has", "had", "having"], answer: 0, explain: "现在完成时 have+过去分词。" },
            { q: "She has ____ visited Paris.", choices: ["yet", "already", "since", "for"], answer: 1, explain: "already 用于肯定句表已经。" },
            { q: "Have you ever ____ sushi? —Yes, I have.", choices: ["eat", "ate", "eaten", "eating"], answer: 2, explain: "ever 后接过去分词。" }
          ],
          speak: [
            { word: "I've been to Japan twice.", roman: "", meaning: "我去过两次日本" },
            { word: "Have you ever traveled abroad?", roman: "", meaning: "你出过国吗？" },
            { word: "The flight was delayed.", roman: "", meaning: "航班延误了" }
          ],
          listen: [
            { audio: "I have never been abroad before.", question: "说话者？", choices: ["出过国", "没出过国", "想出国", "怕出国"], answer: 1 },
            { audio: "Have you ever tried Korean food?", question: "他在问什么？", choices: ["旅行", "饮食经历", "工作", "天气"], answer: 1 },
            { audio: "Our flight was delayed by two hours.", question: "航班怎样？", choices: ["准时", "取消", "延误", "提前"], answer: 2 }
          ]
        }
      ]
    },
    B2: { title: "英语 · 中高级", lessons: [] },
    C1: { title: "英语 · 高级", lessons: [] }
  };

  // ---------- 日语课程 ----------
  const JA = {
    A1: {
      title: "日本語 · 入門",
      lessons: [
        {
          id: "ja-A1-1", title: "あいさつ 寒暄", desc: "こんにちは / ありがとう",
          vocab: [
            { word: "こんにちは", roman: "konnichiwa", meaning: "你好", example: "こんにちは、はじめまして。" },
            { word: "ありがとう", roman: "arigatou", meaning: "谢谢", example: "どうもありがとう。" },
            { word: "さようなら", roman: "sayounara", meaning: "再见", example: "さようなら、またね。" },
            { word: "すみません", roman: "sumimasen", meaning: "对不起/劳驾", example: "すみません、駅はどこですか。" },
            { word: "はい", roman: "hai", meaning: "是/好", example: "はい、そうです。" }
          ],
          grammar: [
            { q: "初めまして、____ ください。", choices: ["こんにちは", "よろしく", "ありがとう", "すみません"], answer: 1, explain: "よろしくお願いします 是常用寒暄。" },
            { q: "—ありがとう。 —____。", choices: ["はい", "すみません", "どういたしまして", "さようなら"], answer: 2, explain: "回应感谢用 どういたしまして。" },
            { q: "____、これは何ですか。", choices: ["こんにちは", "すみません", "ありがとう", "はい"], answer: 1, explain: "提问前用 すみません 引起注意。" }
          ],
          speak: [
            { word: "こんにちは", roman: "konnichiwa", meaning: "你好" },
            { word: "ありがとう", roman: "arigatou", meaning: "谢谢" },
            { word: "さようなら", roman: "sayounara", meaning: "再见" }
          ],
          listen: [
            { audio: "こんにちは、はじめまして。", question: "说话者在做什么？", choices: ["告别", "初次问候", "道歉", "感谢"], answer: 1 },
            { audio: "どうもありがとうございます。", question: "表达的意思？", choices: ["问候", "感谢", "道歉", "请求"], answer: 1 },
            { audio: "すみません、トイレはどこですか。", question: "说话者想？", choices: ["感谢", "告别", "问路", "道歉并询问"], answer: 3 }
          ]
        },
        {
          id: "ja-A1-2", title: "数字 すうじ 数字", desc: "1–10 と年齢",
          vocab: [
            { word: "いち", roman: "ichi", meaning: "一", example: "いち、に、さん。" },
            { word: "じゅう", roman: "juu", meaning: "十", example: "じゅうさいです。" },
            { word: "さい", roman: "sai", meaning: "岁", example: "なんさいですか。" },
            { word: "ねん", roman: "nen", meaning: "年", example: "いちねん。" },
            { word: "なん", roman: "nan", meaning: "几/多少", example: "なんじですか。" }
          ],
          grammar: [
            { q: "—なんさいですか。 —____さいです。", choices: ["じゅう", "こんにちは", "ありがとう", "さようなら"], answer: 0, explain: "回答年龄用数字+さい。" },
            { q: "いち、に、____、し…", choices: ["じゅう", "さん", "ねん", "なん"], answer: 1, explain: "数字顺序 1,2,3 = さん。" },
            { q: "____ねんですね。", choices: ["じゅう", "さん", "いち", "なん"], answer: 1, explain: "三年 = さんねん。" }
          ],
          speak: [
            { word: "いち", roman: "ichi", meaning: "一" },
            { word: "じゅう", roman: "juu", meaning: "十" },
            { word: "なんさいですか", roman: "nansai desu ka", meaning: "你几岁？" }
          ],
          listen: [
            { audio: "わたしはじゅうにさいです。", question: "说话者几岁？", choices: ["10", "11", "12", "20"], answer: 2 },
            { audio: "いち、に、さん、し。", question: "数到了几？", choices: ["2", "3", "4", "5"], answer: 2 },
            { audio: "なんさいですか。", question: "在问什么？", choices: ["姓名", "年龄", "时间", "地点"], answer: 1 }
          ]
        },
        {
          id: "ja-A1-3", title: "家族 かぞく 家庭", desc: "家族称谓 と は/が",
          vocab: [
            { word: "ちち", roman: "chichi", meaning: "父亲(自称)", example: "ちちはせんせいです。" },
            { word: "はは", roman: "haha", meaning: "母亲(自称)", example: "はははりょうりがじょうずです。" },
            { word: "あに", roman: "ani", meaning: "哥哥", example: "あにがいます。" },
            { word: "いもうと", roman: "imouto", meaning: "妹妹", example: "いもうとはわかいです。" },
            { word: "かぞく", roman: "kazoku", meaning: "家人", example: "かぞくをあいしています。" }
          ],
          grammar: [
            { q: "これ____わたしのちちです。", choices: ["は", "が", "を", "に"], answer: 0, explain: "は 是主题助词。" },
            { q: "はは____りょうりをします。", choices: ["は", "が", "を", "で"], answer: 0, explain: "主题用 は。" },
            { q: "あに____がくせいです。", choices: ["は", "が", "を", "に"], answer: 0, explain: "描述身份用 は。" }
          ],
          speak: [
            { word: "ちち", roman: "chichi", meaning: "父亲" },
            { word: "はは", roman: "haha", meaning: "母亲" },
            { word: "かぞく", roman: "kazoku", meaning: "家人" }
          ],
          listen: [
            { audio: "これはわたしのははです。", question: "在介绍谁？", choices: ["父亲", "母亲", "哥哥", "妹妹"], answer: 1 },
            { audio: "あにはがくせいです。", question: "哥哥是？", choices: ["老师", "学生", "医生", "厨师"], answer: 1 },
            { audio: "いもうとはちいさいです。", question: "妹妹怎样？", choices: ["高", "矮/小", "老", "远"], answer: 1 }
          ]
        }
      ]
    },
    A2: {
      title: "日本語 · 初級",
      lessons: [
        {
          id: "ja-A2-1", title: "毎日 まいにち 每天", desc: "ます形 と 時間",
          vocab: [
            { word: "あさ", roman: "asa", meaning: "早上", example: "あさおきます。" },
            { word: "あさごはん", roman: "asagohan", meaning: "早餐", example: "あさごはんをたべます。" },
            { word: "しごと", roman: "shigoto", meaning: "工作", example: "しごとをします。" },
            { word: "ばん", roman: "ban", meaning: "晚上", example: "ばんやすみます。" },
            { word: "いつも", roman: "itsumo", meaning: "总是", example: "いつもバスでいきます。" }
          ],
          grammar: [
            { q: "まいあさ６じ____おきます。", choices: ["に", "で", "を", "が"], answer: 0, explain: "时间点+に。" },
            { q: "かれはまいにちバス____いきます。", choices: ["に", "で", "を", "が"], answer: 1, explain: "交通工具用 で。" },
            { q: "わたしはあさごはん____たべます。", choices: ["に", "で", "を", "が"], answer: 2, explain: "宾语用 を。" }
          ],
          speak: [
            { word: "まいあさおきます", roman: "maiasa okimasu", meaning: "每天早上起床" },
            { word: "しごとをします", roman: "shigoto o shimasu", meaning: "工作" },
            { word: "なんじにおきますか", roman: "nanji ni okimasu ka", meaning: "几点起床？" }
          ],
          listen: [
            { audio: "まいあさ７じにおきます。", question: "几点起床？", choices: ["5点", "6点", "7点", "8点"], answer: 2 },
            { audio: "いつもバスでがっこうにいきます。", question: "怎么上学？", choices: ["步行", "公交", "开车", "骑车"], answer: 1 },
            { audio: "ばんやすみます。", question: "什么时候休息？", choices: ["早上", "中午", "晚上", "凌晨"], answer: 2 }
          ]
        }
      ]
    },
    B1: { title: "日本語 · 中級", lessons: [] },
    B2: { title: "日本語 · 中上級", lessons: [] },
    C1: { title: "日本語 · 上級", lessons: [] }
  };

  // ---------- 韩语课程 ----------
  const KO = {
    A1: {
      title: "한국어 · 입문 韩语入门",
      lessons: [
        {
          id: "ko-A1-1", title: "인사 寒暄", desc: "안녕하세요 / 감사합니다",
          vocab: [
            { word: "안녕하세요", roman: "annyeonghaseyo", meaning: "你好", example: "안녕하세요, 만나서 반갑습니다." },
            { word: "감사합니다", roman: "gamsahamnida", meaning: "谢谢", example: "도와주셔서 감사합니다." },
            { word: "안녕히 가세요", roman: "annyeonghi gaseyo", meaning: "再见(走)", example: "안녕히 가세요." },
            { word: "죄송합니다", roman: "joesonghamnida", meaning: "对不起", example: "늦어서 죄송합니다." },
            { word: "네", roman: "ne", meaning: "是/好", example: "네, 맞아요." }
          ],
          grammar: [
            { q: "—감사합니다. —____.", choices: ["네", "죄송합니다", "천만에요", "안녕하세요"], answer: 2, explain: "回应感谢用 천만에요(不客气)。" },
            { q: "처음 뵙겠습니다. ____ 부탁드립니다.", choices: ["안녕", "잘", "감사", "죄송"], answer: 1, explain: "잘 부탁드립니다 是常用寒暄。" },
            { q: "____, 이것이 뭐예요?", choices: ["안녕하세요", "죄송합니다", "감사합니다", "네"], answer: 1, explain: "提问前用 죄송합니다 引起注意。" }
          ],
          speak: [
            { word: "안녕하세요", roman: "annyeonghaseyo", meaning: "你好" },
            { word: "감사합니다", roman: "gamsahamnida", meaning: "谢谢" },
            { word: "안녕히 가세요", roman: "annyeonghi gaseyo", meaning: "再见" }
          ],
          listen: [
            { audio: "안녕하세요, 만나서 반갑습니다.", question: "说话者在？", choices: ["告别", "初次问候", "道歉", "感谢"], answer: 1 },
            { audio: "도와주셔서 정말 감사합니다.", question: "表达什么？", choices: ["问候", "感谢", "道歉", "请求"], answer: 1 },
            { audio: "죄송합니다, 화장실이 어디예요?", question: "说话者想？", choices: ["感谢", "告别", "问路", "道歉并询问"], answer: 3 }
          ]
        },
        {
          id: "ko-A1-2", title: "숫자 数字", desc: "1–10 과 나이",
          vocab: [
            { word: "하나", roman: "hana", meaning: "一", example: "하나, 둘, 셋." },
            { word: "열", roman: "yeol", meaning: "十", example: "열 살이에요." },
            { word: "살", roman: "sal", meaning: "岁", example: "몇 살이에요?" },
            { word: "해", roman: "hae", meaning: "年", example: "일 년이에요." },
            { word: "몇", roman: "myeot", meaning: "几", example: "몇 시예요?" }
          ],
          grammar: [
            { q: "—몇 살이에요? —____ 살이에요.", choices: ["열", "안녕", "감사", "죄송"], answer: 0, explain: "回答年龄用数字+살。" },
            { q: "하나, 둘, ___, 넷…", choices: ["셋", "열", "해", "몇"], answer: 0, explain: "1,2,3 = 셋。" },
            { q: "____ 년이에요. (3年)", choices: ["열", "셋", "하나", "몇"], answer: 1, explain: "三年 = 석/삼 년(셋 系列)。" }
          ],
          speak: [
            { word: "하나", roman: "hana", meaning: "一" },
            { word: "열", roman: "yeol", meaning: "十" },
            { word: "몇 살이에요", roman: "myeot sarieyo", meaning: "你几岁？" }
          ],
          listen: [
            { audio: "저는 열두 살이에요.", question: "几岁？", choices: ["10", "11", "12", "20"], answer: 2 },
            { audio: "하나, 둘, 셋, 넷.", question: "数到几？", choices: ["2", "3", "4", "5"], answer: 2 },
            { audio: "몇 살이에요?", question: "在问什么？", choices: ["姓名", "年龄", "时间", "地点"], answer: 1 }
          ]
        },
        {
          id: "ko-A1-3", title: "가족 家庭", desc: "가족 与 은/는",
          vocab: [
            { word: "아빠", roman: "appa", meaning: "爸爸", example: "아빠는 선생님이에요." },
            { word: "엄마", roman: "eomma", meaning: "妈妈", example: "엄마는 요리를 잘해요." },
            { word: "형", roman: "hyeong", meaning: "哥哥(男称)", example: "형이 있어요." },
            { word: "여동생", roman: "yeodongsaeng", meaning: "妹妹", example: "여동생이 어려요." },
            { word: "가족", roman: "gajok", meaning: "家人", example: "가족을 사랑해요." }
          ],
          grammar: [
            { q: "이것____저의 아빠예요.", choices: ["은", "는", "이", "을"], answer: 1, explain: "이것 后接 는(以 ㄷ结尾)。" },
            { q: "엄마____요리해요.", choices: ["은", "는", "이", "을"], answer: 1, explain: "엄마 后用 는(无终声)。" },
            { q: "형____학생이에요.", choices: ["은", "는", "이", "을"], answer: 0, explain: "형 有终声 ㅇ 用 은。" }
          ],
          speak: [
            { word: "아빠", roman: "appa", meaning: "爸爸" },
            { word: "엄마", roman: "eomma", meaning: "妈妈" },
            { word: "가족", roman: "gajok", meaning: "家人" }
          ],
          listen: [
            { audio: "이것은 저의 엄마예요.", question: "在介绍谁？", choices: ["爸爸", "妈妈", "哥哥", "妹妹"], answer: 1 },
            { audio: "형은 학생이에요.", question: "哥哥是？", choices: ["老师", "学生", "医生", "厨师"], answer: 1 },
            { audio: "여동생은 어려요.", question: "妹妹怎样？", choices: ["高", "小/年轻", "老", "远"], answer: 1 }
          ]
        }
      ]
    },
    A2: {
      title: "한국어 · 초급 韩语初级",
      lessons: [
        {
          id: "ko-A2-1", title: "매일 每天", desc: "해요体 与 时间",
          vocab: [
            { word: "아침", roman: "achim", meaning: "早上", example: "아침에 일어나요." },
            { word: "아침 식사", roman: "achim siksa", meaning: "早餐", example: "아침 식사를 해요." },
            { word: "일", roman: "il", meaning: "工作", example: "일을 해요." },
            { word: "저녁", roman: "jeonyeok", meaning: "晚上", example: "저녁에 쉬어요." },
            { word: "항상", roman: "hangsang", meaning: "总是", example: "항상 버스로 가요." }
          ],
          grammar: [
            { q: "매일 아침 6시____일어나요.", choices: ["에", "로", "을", "이"], answer: 0, explain: "时间点+에。" },
            { q: "매일 버스____가요.", choices: ["에", "로", "을", "이"], answer: 1, explain: "交通工具用 (으)로。" },
            { q: "아침 식사____해요.", choices: ["에", "로", "을", "이"], answer: 2, explain: "宾语用 을。" }
          ],
          speak: [
            { word: "아침에 일어나요", roman: "achim-e ireonayo", meaning: "早上起床" },
            { word: "일을 해요", roman: "il-eul haeyo", meaning: "工作" },
            { word: "몇 시에 일어나요", roman: "myeot si-e ireonayo", meaning: "几点起床？" }
          ],
          listen: [
            { audio: "매일 아침 7시에 일어나요.", question: "几点起床？", choices: ["5点", "6点", "7点", "8点"], answer: 2 },
            { audio: "항상 버스로 학교에 가요.", question: "怎么上学？", choices: ["步行", "公交", "开车", "骑车"], answer: 1 },
            { audio: "저녁에 쉬어요.", question: "什么时候休息？", choices: ["早上", "中午", "晚上", "凌晨"], answer: 2 }
          ]
        }
      ]
    },
    B1: { title: "한국어 · 중급 韩语中级", lessons: [] },
    B2: { title: "한국어 · 중상급", lessons: [] },
    C1: { title: "한국어 · 고급", lessons: [] }
  };

  const DATA = { en: EN, ja: JA, ko: KO };

  const Courses = {
    LANGUAGES,
    LEVELS,
    data: DATA,

    getLanguages() { return LANGUAGES; },
    getLevels() { return LEVELS; },

    getLanguage(code) {
      return LANGUAGES.find((l) => l.code === code) || null;
    },
    getLevelData(lang, level) {
      const l = DATA[lang];
      return l && l[level] ? l[level] : null;
    },
    getLesson(lang, level, lessonId) {
      const lv = this.getLevelData(lang, level);
      if (!lv) return null;
      return lv.lessons.find((ls) => ls.id === lessonId) || null;
    },
    // 取某语言全部课程（扁平化）按 level->lesson
    getAllLessons(lang) {
      const out = [];
      LEVELS.forEach((lv) => {
        const d = this.getLevelData(lang, lv.code);
        if (d && d.lessons.length) {
          d.lessons.forEach((ls) => out.push({ ...ls, level: lv.code, levelName: lv.name }));
        }
      });
      return out;
    },
    // 总课时数
    countLessons(lang) {
      return this.getAllLessons(lang).length;
    }
  };

  global.Courses = Courses;
})(window);
