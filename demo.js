(() => {
// メール文面の原本：テンプレ集（Googleドキュメント）。文面を直すときはここを直す。
// {key} はAIまたはツールが埋める差し込み。★の注記はここには入れない。

const INTRO = [
  'MiraiWayは武蔵野大学アントレプレナーシップ学部の学生を中心に、日本とスリランカをつなぐことを軸に活動しているスタートアップです。',
  '',
  '■ 人材事業　特定技能人材を中心とした外国人材の採用・定着支援',
  '■ 制作事業　Webサイト制作、動画の撮影・編集、SNS運用、ロゴ制作など、クリエイティブ全般の制作',
  '■ 日本語教育事業　外国人を対象とした法人・個人向けの日本語教育',
  '',
  'このほか、日本・スリランカ間のビジネス連携、通訳・海外事業のコーディネーション、貿易・輸出入、大学・若者・起業家との連携など、幅広い領域でのご相談・ご連携も歓迎しております。',
].join('\n');

const HEAD = '{company}\n{deptLine}{name}様\n\nお世話になっております。\nMiraiWayの{sender}です。\n\n';

// 日程：候補日を送る／日程を聞く
const SCHED_DATES = '以下の日程でご都合はいかがでしょうか。\n{dates}';
const SCHED_ASK = 'ご都合のよい日時をいくつかお知らせいただけますと幸いです。';

const SCENES = {
  '01': {
    label: '01 挨拶・名刺交換のみ',
    subject: '【御礼】{event}での名刺交換のお礼／MiraiWay {sender}',
    body: HEAD + '昨日は{event}にて名刺交換の機会をいただき、誠にありがとうございました。\n短い時間ではございましたが、ご挨拶させていただけて嬉しく思っております。\n\n' + INTRO +
      '\n\nお役に立てそうなことがございましたら、資料のご送付やオンラインでのご説明など、お気軽にお声がけいただけますと幸いです。\n\n引き続き、どうぞよろしくお願いいたします。',
  },
  '02': {
    label: '02 会話・意見交換',
    subject: '【御礼】{event}でのお礼／MiraiWay {sender}',
    body: HEAD + '昨日は{event}にて、お話しする機会をいただき、誠にありがとうございました。\n{talkSentence}\n学生の私たちのお話にも丁寧に耳を傾けていただき、心より感謝申し上げます。\n\n改めまして、' + INTRO +
      '\n\n上記の分野でお役に立てそうなことがございましたら、資料のご送付やオンラインでのご説明など、お気軽にお声がけください。\nまた、改めてお話を伺える機会をいただけますと幸いです。\n\n引き続き、どうぞよろしくお願いいたします。',
  },
  '03': {
    label: '03 事業への関心',
    subject: '【御礼】{event}でのお礼とご面談のお願い／MiraiWay {sender}',
    body: HEAD + '昨日は{event}にて、お話しする機会をいただき、誠にありがとうございました。\n{interest}にご関心をお寄せいただき、大変嬉しく思っております。\n\n' + INTRO +
      '\n\n{block}\n\nつきましては、30分ほどオンラインにて、ご説明とあわせて{name}様のお考えもお伺いできれば幸いです。\n{sched}\n\nご都合が合わない場合や、事前に資料をご希望の場合も、お気軽にお申し付けください。\n\n引き続き、どうぞよろしくお願いいたします。',
    blocks: {
      A: 'お伺いした{blockTopic}のお話を踏まえ、MiraiWayとしてご一緒できることがないか、ぜひ一度ご相談させていただければと考えております。',
      B: 'お伺いした人材確保・定着に関するお話について、弊社の人材事業で、スリランカ人材の採用から定着までお力になれるのではないかと考えております。',
      C: 'お伺いした{blockTopic}に関するお話について、弊社の制作事業で、企画から制作までお手伝いできるのではないかと考えております。',
      D: 'お伺いした外国人スタッフの日本語に関するお話について、弊社の日本語教育事業で、職場に合わせた学習支援をご提案できるのではないかと考えております。',
      E: 'お伺いした{blockTopic}のお取り組みについて、MiraiWayのスリランカとのつながりを活かし、ご一緒できる可能性があるのではないかと感じております。',
      F: '学生の私たちの挑戦に温かいお言葉をいただき、大変励みになりました。ぜひ今後も、活動のご報告やご相談をさせていただければ幸いです。',
    },
    sched: true,
  },
  '04': {
    label: '04 約束あり',
    subject: '【御礼】{event}でのお礼と{promise}／MiraiWay {sender}',
    body: HEAD + '昨日は{event}にて、お話しする機会をいただき、誠にありがとうございました。\n{talkTopic}についてのお話はとても印象深く、さっそくご連絡させていただきました。\n\n{block}\n\nなお、改めてMiraiWayについてご紹介させていただきます。\n' + INTRO +
      '\n\nご不明な点がございましたら、お気軽にお申し付けください。\n\n引き続き、どうぞよろしくお願いいたします。',
    blocks: {
      '1': 'お約束しておりました{blockTopic}の資料を添付にてお送りいたします。\nご確認のうえ、ご不明点やご要望がございましたら、お気軽にお知らせください。',
      '2': 'お話しした{blockTopic}の件につきまして、{sched}\nご都合が合わない場合は、候補日をお知らせいただけますと幸いです。',
      '3': 'お話ししておりました{introName}様をご紹介させていただきます。\n{introName}様は{introRole}をされている方で、{introBenefit}の点でお役に立てるのではないかと考えております。\nよろしければ、お二人をおつなぎするメールをお送りいたしますので、ご都合をお知らせください。',
    },
    blockLabels: { '1': '①資料送付', '2': '②日程調整', '3': '③ご紹介' },
    promiseBy: { '1': '資料のご送付', '2': '日程のご相談', '3': 'ご紹介' },
  },
  '05': {
    label: '05 ご紹介のお願い',
    subject: '【御礼】{event}でのお礼と{bizName}のご相談／MiraiWay {sender}',
    body: HEAD + '昨日は{event}にて、お話しする機会をいただき、誠にありがとうございました。\n{caseTopic}の案件についてお話をいただき、大変嬉しく思っております。\n\n{block}\n\n' + INTRO +
      '\n\nご紹介用の資料もご用意しておりますので、お気軽にお申し付けください。\n\n引き続き、どうぞよろしくお願いいたします。',
    blocks: {
      A: 'お伺いした{blockTopic}のお話を踏まえ、MiraiWayとしてご一緒できることがないか、ぜひ一度ご相談させていただければと考えております。',
      B: '外国人材の採用・定着については、検討段階のご相談からでも承っております。ご関心のある企業様がいらっしゃいましたら、ぜひ一度お話しできるよう、おつなぎいただけますと幸いです。',
      C: 'Webサイトや動画、SNSなど、企画から制作まで一貫して対応しております。制作のご予定がある企業様がいらっしゃいましたら、ぜひおつなぎいただけますと幸いです。',
      D: '外国人スタッフの日本語について、現場のお悩みに合わせた学習支援をご提案しております。気になる点がございましたら、ぜひお気軽にお聞かせください。',
      E: 'スリランカとの取引や海外展開について、情報交換からでもご一緒できれば嬉しく思います。ご関心のある方がいらっしゃいましたら、ぜひおつなぎいただけますと幸いです。',
    },
  },
};

const BLOCK_LABELS_ABC = { A: 'A 全体', B: 'B 人材', C: 'C 制作', D: 'D 日本語教育', E: 'E 協業', F: 'F 応援' };

// 本文を組み立てる。足りない差し込みは「〇〇」のまま残し、承認前に気づけるようにする。
function buildMail(c, ev, member, cfg = {}) {
  const s = SCENES[c.scene] || SCENES['01'];
  const slots = Object.assign({}, c.slots || {});
  const dates = (c.dates || []).filter(String);
  const sched = c.schedMode === 'ask'
    ? SCHED_ASK
    : SCHED_DATES.replace('{dates}', (dates.length ? dates : ['〇月〇日（〇）〇時〜〇時']).map(d => '・' + d).join('\n'));
  let block = s.blocks ? (s.blocks[c.block] || '') : '';
  const dt = [c.dept, c.title].filter(Boolean).join(' ');
  const v = Object.assign({
    company: c.company || '', deptLine: dt ? dt + '\n' : '',
    name: c.name || '〇〇', sender: member ? member.name : '〇〇', event: ev.name,
    promise: (s.promiseBy || {})[c.block] || '〇〇', sched,
  }, slots);
  const fill = t => t.replace(/\{(\w+)\}/g, (_, k) => (v[k] !== undefined && (v[k] !== '' || k === 'deptLine') ? v[k] : '〇〇'));
  v.block = fill(block);
  let body = fill(s.body);
  if (c.schedMode === 'ask') {
    // 「日程を聞く」のときは、候補日を前提にした言い回しを外す
    body = body.replace('\nご都合が合わない場合は、候補日をお知らせいただけますと幸いです。', '')
      .replace('ご都合が合わない場合や、事前に資料をご希望の場合も、', '事前に資料をご希望の場合も、');
  }
  return { subject: fill(s.subject), body: body + '\n\n' + signature(member, cfg) };
}

function signature(m, cfg = {}) {
  const web = cfg.SIGN_WEB, sns = cfg.SIGN_SNS; // 例 SIGN_SNS = "Instagram：@miraiway"
  const lines = ['――――――――――', 'MiraiWay', m && m.romaji ? `${m.name}（${m.romaji}）` : (m ? m.name : ''), '', 'Email：miraiwayjapan@gmail.com'];
  if (m && m.phone) lines.push('Tel：' + m.phone);
  if (web) lines.push('Web：' + web);
  if (sns) lines.push(sns);
  lines.push('――――――――――');
  return lines.join('\n');
}
// ───── デモ版（ログイン不要・端末の中だけで動く） ─────
// 本物のサーバー・Gmail・Drive・Slack・AI には一切つながない。データはこのタブの中だけ（タブを閉じると消える）
// メール文面は本物のテンプレート（上に連結される templates.js の buildMail）で作る
(() => {
  const ME = 'デモユーザー', MEMBERS = [ME, '田中 美月', '山本 蓮'];
  const wait = ms => new Promise(r => setTimeout(r, ms));
  const id = () => (crypto.randomUUID ? crypto.randomUUID() : String(Math.random()).slice(2));
  const iso = (d = 0) => { const t = new Date(Date.now() + d * 864e5); return new Date(t - t.getTimezoneOffset() * 6e4).toISOString().slice(0, 10); };
  const hhmm = () => { const d = new Date(); return `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const bad = m => { throw new Error(m); };
  const me = { name: ME, romaji: 'Demo User', phone: '090-0000-0000' };
  const cfg = { SIGN_WEB: '', SIGN_SNS: '' };

  // 見本の名刺画像（その場で絵を描く）
  const cardImg = (co, nm, col) => 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="550" height="320"><rect width="550" height="320" fill="#FCFCFA"/><rect width="12" height="320" fill="${col}"/>` +
    `<text x="40" y="60" font-family="sans-serif" font-size="24" font-weight="700" fill="${col}">${co}</text>` +
    `<text x="40" y="170" font-family="sans-serif" font-size="38" font-weight="700" fill="#111">${nm}</text>` +
    `<text x="40" y="270" font-family="sans-serif" font-size="15" fill="#555">TEL 03-0000-0000</text></svg>`);
  // 取り込むたびに順番に出てくる「読み取り結果」の見本
  const SAMPLES = [
    { company: '株式会社サンプル商事', dept: '人事部', title: '部長', name: '山田 太郎', email: 'yamada@example.com', col: '#1a3a6b' },
    { company: 'ミライ制作合同会社', dept: '企画室', title: '室長', name: '鈴木 花子', email: 'suzuki@example.com', col: '#8a2b2b' },
    { company: '東京グローバル協会', dept: '国際交流課', title: '主任', name: '田中 一郎', email: 'tanaka@example.org', col: '#245c3a' },
    { company: '株式会社ネクストリンク', dept: '事業開発部', title: 'マネージャー', name: '佐々木 美咲', email: 'sasaki@example.com', col: '#4b2a7a' },
    { company: 'さくら製作所', dept: '総務部', title: '課長', name: '高橋 健', email: 'takahashi@example.com', col: '#7a5a12' },
  ];
  let next = 0;

  const E = [], C = [];
  const mkC = (s, ev, extra = {}) => {
    const c = Object.assign({ id: id(), eventId: ev.id, by: ME, fileKey: cardImg(s.company, s.name, s.col), company: s.company, dept: s.dept, title: s.title, name: s.name,
      email: s.email, phone: '', reunion: [], scene: '01', block: '', slots: {}, schedMode: 'ask', dates: [], status: 'draft', reason: '', filed: false }, extra);
    Object.assign(c, buildMail(c, ev, me, cfg)); return c;
  };
  // 最初から入っている見本（過去のイベントと、承認済みの相手）
  const past = { id: id(), name: '外国人材活用セミナー', date: iso(-6), fee: '', members: [ME, '田中 美月'], heat: 'A', targets: '', url: '', slack: false, sokuho: false, slackReport: false, folderId: 'demo', memos: [], photos: 4, status: '開催中', reports: {} };
  E.push(past);
  C.push(mkC(SAMPLES[3], past, { status: 'sent', scene: '03', block: 'B', target: '採用企業', next: 'アポ打診', due: iso(-1), hot: '特定技能の受け入れを検討', note: '外国人材の採用に関心', filed: true }));
  C.push(mkC(SAMPLES[4], past, { status: 'sent', scene: '04', block: '1', biz: '人材', target: '採用企業', next: '資料送付', due: iso(3), hot: '資料を社内で共有したい', filed: true }));

  // 話した内容から、相手ごとのシーンを決める（デモ用の簡易判定。本物はAIが判断）
  const BIZ = t => /制作|動画|Web|ウェブ|サイト|SNS|ロゴ/.test(t) ? ['制作', 'C', '制作事業'] : /日本語/.test(t) ? ['日本語教育', 'D', '日本語教育事業'] : ['人材', 'B', '人材事業'];
  function judge(c, talk, only) {
    const keys = [c.company.replace(/株式会社|合同会社|有限会社/g, '').slice(0, 4), (c.name || '').split(' ')[0]].filter(Boolean);
    // 相手が1人だけなら、話した内容すべてをその人のこととして読む
    const sent = only ? talk.replace(/^。+|。+$/g, '') : (talk.split(/[。\n]/).find(s => keys.some(k => k && s.includes(k))) || '');
    const [biz, blk, bizTopic] = BIZ(sent);
    if (!sent) return { scene: '01', block: '', next: 'なし', reason: '話した内容に出てこなかったため、挨拶のメールにしました' };
    if (/資料/.test(sent)) return { scene: '04', block: '1', biz, next: '資料送付', due: iso(2), slots: { talkTopic: bizTopic, blockTopic: bizTopic }, reason: '資料を送る約束があったため 04①', hot: '資料の約束' };
    if (/打ち合わせ|日程|アポ|面談|来週|オンライン/.test(sent)) return { scene: '04', block: '2', biz, next: 'アポ打診', due: iso(7), slots: { talkTopic: '今後のご連携', blockTopic: 'オンラインでのお打ち合わせ' }, reason: '打ち合わせの約束があったため 04②', hot: '打ち合わせの約束' };
    if (/紹介してくれ|紹介いただ|案件/.test(sent)) return { scene: '05', block: blk === 'B' ? 'B' : 'A', biz, next: '紹介', due: iso(7), slots: { bizName: bizTopic.replace('事業', ''), caseTopic: bizTopic, blockTopic: bizTopic }, reason: '紹介や案件の話があったため 05', hot: '紹介してくれそう' };
    if (/関心|興味|困って|課題/.test(sent)) return { scene: '03', block: blk, biz, next: 'その他', due: iso(7), slots: { interest: bizTopic, blockTopic: bizTopic }, reason: '事業に関心を示してくれたため 03', hot: '事業に関心' };
    return { scene: '02', block: '', next: 'なし', slots: { talkSentence: '貴重なお話を伺うことができ、大変勉強になりました。' }, reason: '会話をしたため 02' };
  }

  const getEv = i => E.find(e => e.id === i) || bad('見つかりません');
  const mineC = i => C.find(c => c.id === i) || bad('見つかりません');
  const evOut = i => ({ ev: getEv(i), contacts: C.filter(c => c.eventId === i), total: C.filter(c => c.eventId === i).length });
  const sum = () => {
    const t = iso(), soon = iso(7), actions = C.filter(c => c.next && c.next !== 'なし' && !c.nextDone && c.status !== 'draft' && (!c.due || c.due <= soon))
      .sort((a, b) => (a.due || '9').localeCompare(b.due || '9')).map(c => ({ id: c.id, company: c.company, name: c.name, next: c.next, due: c.due || '', late: !!c.due && c.due < t }));
    const draftsBy = {}; C.filter(c => c.status === 'draft').forEach(c => draftsBy[c.eventId] = (draftsBy[c.eventId] || 0) + 1);
    return { drafts: Object.values(draftsBy).reduce((a, b) => a + b, 0), draftsBy, actions };
  };
  const init = () => ({ me: ME, members: MEMBERS, events: E.slice().sort((a, b) => b.date.localeCompare(a.date)), sum: sum() });
  const evName = c => (E.find(e => e.id === c.eventId) || {}).name || '';
  const evDate = c => (E.find(e => e.id === c.eventId) || {}).date || '';

  const API = {
    api_init: () => init(),
    api_dashboard: () => {
      const evs = E.filter(e => !e.solo).sort((a, b) => b.date.localeCompare(a.date)), t = iso();
      const n = (l, f) => l.filter(f).length;
      return { home: init(), month: t.slice(0, 7), lead: '', errors: [],
        kpi: { events: evs.length, cards: C.length, target: n(C, c => c.target && c.target !== '対象外'), deep: 0, sent: n(C, c => c.status === 'sent'), drafts: n(C, c => c.status === 'draft') },
        events: evs.map(e => { const l = C.filter(c => c.eventId === e.id); return { id: e.id, name: e.name, date: e.date, heat: e.heat, members: e.members, cards: l.length, target: n(l, c => c.target), deep: 0, drafts: n(l, c => c.status === 'draft'), sent: n(l, c => c.status === 'sent'), reports: 0, slack: false, judge: '' }; }),
        actions: sum().actions.map(a => Object.assign({ by: ME }, a)),
        people: MEMBERS.map(m => ({ name: m, cards: n(C, c => c.by === m), drafts: n(C, c => c.by === m && c.status === 'draft'), late: 0, owed: 0 })) };
    },
    api_createEvent: f => { if (!f.name || !f.date) bad('イベント名と日付を入れてください'); const old = E.find(e => e.id === f.id); if (old) return old;
      const ev = { id: f.id || id(), name: f.name, date: f.date, fee: f.fee || '', members: f.members || [ME], heat: f.heat || 'B', targets: f.targets || '', url: '', slack: false, sokuho: false, slackReport: false, solo: !!f.solo, folderId: '', memos: [], photos: 0, status: '開催中', reports: {} };
      E.push(ev); return ev; },
    api_updateSolo: (i, f) => Object.assign(getEv(i), { name: f.name, date: f.date }),
    api_getEvent: i => evOut(i),
    api_addMemo: (i, text) => { const ev = getEv(i); ev.memos.push({ id: id(), t: hhmm(), by: ME, text }); return ev.memos; },
    api_deleteMemo: (i, m) => { const ev = getEv(i); ev.memos = ev.memos.filter(x => x.id !== m.id); return ev.memos; },
    api_upload: async (i, b64, mime) => {
      await wait(1800 + Math.random() * 1400); // 読み取っている時間の再現
      const s = SAMPLES[next++ % SAMPLES.length], ev = getEv(i);
      const c = mkC(s, ev, { fileKey: `data:${mime};base64,${b64}`, reason: 'デモ：読み取り結果は見本です' });
      C.push(c); return c;
    },
    api_reread: async i => { await wait(1500); return mineC(i); },
    api_assign: async (i, talk) => {
      await wait(2500 + Math.random() * 1500);
      const ev = getEv(i); ev.talk = { [ME]: talk };
      const ds = C.filter(c => c.eventId === i && c.status === 'draft');
      ds.forEach(c => {
        const j = judge(c, String(talk || '') + '。' + ev.memos.map(m => m.text).join('。'), ds.length === 1);
        Object.assign(c, { slots: {} }, j, { schedMode: 'ask', edited: false, target: j.scene === '01' ? '対象外' : '採用企業' });
        Object.assign(c, buildMail(c, ev, me, cfg));
      });
      return evOut(i);
    },
    api_updateContact: p => { const c = mineC(p.id); if (c.status === 'sent') bad('送信済みです');
      ['company', 'dept', 'title', 'name', 'email', 'scene', 'block', 'schedMode', 'dates', 'dtRaw', 'slots', 'subject', 'body', 'edited'].forEach(f => { if (p[f] !== undefined) c[f] = p[f]; });
      if (!c.edited) Object.assign(c, buildMail(c, getEv(c.eventId), me, cfg)); c.status = 'draft'; return c; },
    api_approve: i => { const c = mineC(i);
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(c.email)) bad('メールアドレスを確認してください');
      if (/〇/.test(c.subject + c.body)) bad('「〇〇」が残っています。直してから承認してください');
      c.status = 'approved'; return c; },
    api_cancel: i => { const c = mineC(i); if (c.status !== 'approved') bad('取り消せません'); c.status = 'draft'; c.sendAt = null; return c; },
    api_cancelAll: i => { const l = C.filter(c => c.eventId === i && c.status === 'approved'); l.forEach(c => { c.status = 'draft'; c.sendAt = null; }); return l.map(c => c.id); },
    api_setSendTime: (i, mode, at) => {
      const l = C.filter(c => c.eventId === i && c.status === 'approved'); if (!l.length) bad('送信待ちのメールがありません');
      const sendAt = mode === 'now' ? new Date().toISOString() : mode === 'at' ? new Date(at).toISOString() : null;
      l.forEach(c => { c.sendAt = sendAt; if (mode === 'now') setTimeout(() => { c.status = 'sent'; }, 1500); }); // デモでは実際には送らず「送信済み」にする
      return l.map(c => ({ id: c.id, sendAt }));
    },
    api_organizeSoon: () => null,
    api_deleteContact: i => { const k = C.findIndex(c => c.id === i); if (k >= 0) C.splice(k, 1); return true; },
    api_actionDone: i => { mineC(i).nextDone = true; return sum(); },
    api_leads: () => C.filter(c => c.status !== 'draft').map(c => ({ id: c.id, company: c.company, name: c.name, by: c.by, status: c.status, target: c.target || '', deep: false, biz: c.biz || '',
      next: c.next || 'なし', due: c.due || '', nextDone: !!c.nextDone, hot: c.hot || '', note: c.note || '', email: c.email, event: evName(c), date: evDate(c) })),
    api_updateLead: (i, p) => { Object.assign(mineC(i), p); return true; },
    api_contacts: q => { const w = String(q || '').toLowerCase().split(/\s+/).filter(Boolean);
      return C.map(c => ({ id: c.id, company: c.company, name: c.name, dept: c.dept, by: c.by, status: c.status, event: evName(c), date: evDate(c) }))
        .filter(c => w.every(x => `${c.company} ${c.name} ${c.event}`.toLowerCase().includes(x))); },
    api_contact: i => { const c = mineC(i); return Object.assign({}, c, { eventName: evName(c), eventDate: evDate(c), met: [] }); },
    api_settings: () => ({ name: ME, romaji: me.romaji, phone: me.phone, web: '', sns: '', preview: signature(me, cfg) }),
    api_saveSettings: f => { me.romaji = f.romaji; me.phone = f.phone; return API.api_settings(); },
    api_parentPreview: i => `【${getEv(i).name}】\n（デモ版のため、Slack には投稿されません）`,
    api_postParent: i => Object.assign(getEv(i), { slackTs: 'demo' }),
    api_sokuho: (i, f) => Object.assign(getEv(i), { sokuho: Object.assign({ by: ME }, f) }),
    api_reportDraft: i => { const l = C.filter(c => c.eventId === i); return { draft: { cards: l.length, target: l.filter(c => c.target && c.target !== '対象外').length, deep: 0, hot: [], judge: '一部達成', filed: true }, saved: null }; },
    api_reportPreview: (i, r) => ({ notes: r.notes || 'なし', text: `【終了報告】${getEv(i).name}\n（デモ版のため、Slack には投稿されません）` }),
    api_tidyNotes: t => t,
    api_submitReport: () => ({ posted: false }),
  };
  window.DEMO = {
    call: async (fn, args) => {
      await wait(60); // 本物と同じく、ほぼ一瞬で返る
      if (!API[fn]) throw new Error('デモ版では使えない操作です');
      return API[fn](...args.slice(1)); // 先頭のログイン情報は使わない
    },
  };
})();
})();
