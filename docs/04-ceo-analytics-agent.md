# CEO Agent + Analytics Agent Prompt Template
## TRIZアプリ：意思決定システム・データ分析エージェント

---

## Part 1: CEO Agent（意思決定システム）

### エージェント定義

**名前**: CEO Agent（CEOAE）

**目的**: あなたの意思決定を加速化し、4 つの専門エージェントに明確な指示を下す

**権限**:
- 週間目標の設定
- 優先度の決定
- リソース配分（実装時間・予算）
- 方向転換の決定

---

## Weekly CEO Workflow

### 🔴 **Monday Morning: 週間目標設定（30 分）**

**あなた（CEO）が毎週月曜朝にやること**:

```
【Monday 朝の儀式】

Step 1: 前週の KPI を見る（5 分）
- Analytics Agent が金曜に作成した「週報」を確認
- 「うまくいったこと」「失敗したこと」を整理

Step 2: 今週の優先度を決める（10 分）
- 4 つのエージェントの中で「誰にリソースを集中させるか」
- 例）「Product の仮説検証を最優先」「Marketing は コンテンツ定期投稿のみ」

Step 3: 制約を設定（5 分）
- 「Engineer の実装時間は最大 20h 以内」
- 「新規 UI 追加は禁止、既存 UI の改善のみ」
- 「予算は使わない（Claude API コストのみ）」

Step 4: 各エージェントに「週の指示」を書く（10 分）
- 形式：下記のテンプレート
- Notion の「Weekly Goals」に記入
```

**月曜指示テンプレート**:

```markdown
# Weekly Goals - Week 2 (3/31～4/6)

## 背景
- 先週の仮説 #1「矛盾図表示」は 58% 理解度で「微妙」
- 学び：「説明が足りない」→ 仮説 #2「AI チャット」へ進む必要がある
- リード数は 5 件で目標達成。セグメント別で見ると B2C が弱い

## 週間目標

### Priority 1: Product Agent
**目標**: 仮説 #2「AI チャット」のテスト設計完了

- 活動内容：
  - ユーザーテスト 5 名をリクルート（Marketing に依頼）
  - テスト手順書を完成
  - 期待スコア：75% 以上

- 制約：
  - テスト実施は木曜～金曜（Engineer の実装待ち）
  - UI は「チャット入力」1 画面のみ

### Priority 2: Engineer Agent
**目標**: AI チャット機能の実装と Google Antigravity へのデプロイ

- 活動内容：
  - Claude API エンドポイント作成：/api/chat
  - React チャット UI 実装
  - テスト環境へデプロイ

- 制約：
  - 実装時間：最大 6h（費用削減）
  - 水曜までに「テスト可能な状態」に

### Priority 3: Marketing Agent
**目標**: B2C セグメント強化と リード質改善

- 活動内容：
  - Twitter スレッド（AI + TRIZ）を週 2 本投稿
  - Qiita 記事 1 本（チュートリアル）
  - リード 5 件以上獲得

- 制約：
  - B2C 優先（新規ユーザーが目標）
  - コンテンツ品質は譲らない（1000 文字以上）

### Priority 4: Analytics Agent
**目標**: 日次 KPI 監視＋金曜に詳細レポート

- 活動内容：
  - 毎日「DAU」「新規ユーザー」「セグメント別リード」を追跡
  - 金曜に「週報」を作成
  - 来週の方向を提案

## 資源制約

- Claude API コスト：$50/週 以内
- 実装時間：20h 以内（Engineer）
- あなたの時間：月 30 分（指示）+ 週 1.5h（確認）

## CEO からの質問・相談

- Engineer へ：「チャット UI のテンプレートは何を使いますか？」
- Product へ：「ユーザーテスト 5 名、どこからリクルートします？」
- Analytics へ：「セグメント別 CAC の計算方法を教えてください」
```

---

## Part 2: Analytics Agent（データ分析・判断支援）

### エージェント定義

**名前**: Analytics Agent（ANAE）

**目的**: 生のデータから「判断に必要な情報」を抽出し、CEO の意思決定を支援

**権限**:
- KPI 計測・可視化
- 仮説の成功・失敗判定
- 次週の施策提案

---

## Weekly Analytics Workflow

### 🟡 **Daily: KPI モニタリング（毎日 5 分）**

**自動化タスク（Claude Code で実装）**:

```python
# daily_kpi_report.py

import anthropic
from datetime import datetime

def generate_daily_kpi():
    """毎日 9:00 に自動実行"""
    
    # Supabase からデータを取得
    daily_data = fetch_from_supabase({
        "table": "daily_metrics",
        "date": datetime.now().date()
    })
    
    # Analytics Prompt を実行
    client = anthropic.Anthropic()
    
    prompt = f"""あなたは TRIZ アプリの分析エージェント。

【昨日のデータ】
- DAU: {daily_data['dau']} 人
- 新規ユーザー: {daily_data['new_users']} 人
- 問題解析数: {daily_data['analyses']} 件
- 理解度スコア: {daily_data['avg_comprehension']}%
- リード: {daily_data['leads']} 件

【前日比】
- DAU: {daily_data['dau_prev']} 人 → 前日比 {((daily_data['dau'] / daily_data['dau_prev'] - 1) * 100):.1f}%
- 新規ユーザー: {daily_data['new_users_prev']} 人 → 前日比 {((daily_data['new_users'] / daily_data['new_users_prev'] - 1) * 100):.1f}%

【実行】
1. 「順調か」「懸念か」を簡潔に判定
2. セグメント別の違いがあるか
3. 「注目すべき数字」は何か

【出力フォーマット】
- ステータス：🟢 順調 / 🟡 要注視 / 🔴 警告
- 主な気づき：1～2 点
- 懸念事項：あれば
"""
    
    message = client.messages.create(
        model="claude-opus-4-20250514",
        max_tokens=500,
        messages=[{"role": "user", "content": prompt}]
    )
    
    # 結果を Notion に自動掲載
    post_to_notion(message.content[0].text)
```

**あなたが見る形式（Notion ダッシュボード）**:

```
【Daily KPI Dashboard】

🟢 Monday 3/31
- DAU：92 人（+3%）
- 新規：8 人（+1人）
- 理解度：58%（変化なし）
- リード：1 件（B2C）

🟡 Tuesday 4/1
- DAU：85 人（-7%）← 低下！原因不明
- 新規：5 人（-3 人）
- 理解度：59%
- リード：1 件（B2B）
⚠️ 懸念：DAU が低下。Product の施策の影響？

...

【まとめ】
- 週平均 DAU：89 人（前週：80 人、+11%）
- 新規ユーザー：40 人（目標 20 人達成 ✅）
- リード：5 件（目標 5 件達成 ✅）
```

### 🔴 **Friday Afternoon: 週報・提案作成（1 時間）**

**金曜 16:00 に自動実行**:

```markdown
# Analytics Report - Week 2

## 📊 KPI Summary

| 指標 | Week 2 | Week 1 | 前週比 | 目標 | 達成 |
|------|--------|--------|--------|------|------|
| DAU | 92 | 80 | +15% | 100 | 92% |
| 新規ユーザー | 40 | 20 | +100% | 20 | ✅ |
| リード数 | 5 | 5 | 0% | 5 | ✅ |
| 理解度スコア | 58% | 50% | +8pp | 70% | 83% |
| CAC | $0 | $0 | - | <$50 | ✅ |

## 📈 セグメント別分析

### B2C（個人学習者）
- 新規ユーザー：25 人（目標 15 人達成 ✅）
- DAU：60 人
- リテンション：Day7 45% → Day7 48%（改善 ✅）
- 理解度スコア：58%（目標 70% に対して 83%）

**学び**: Twitter スレッドの「AI + TRIZ」が刺さっている

### B2B（企業研修）
- リード：2 件（目標 2 件達成 ✅）
- リード品質：「年商 10 億以上」が来ている
- CAC：$0（自然検索）
- デモ実施率：50%（1 件で Zoom 実施）

**学び**: LinkedIn より「業界メディア」からの流入が多い

### B2B2C（教育機関向け）
- リード：1 件のみ（目標 1 件達成 ✅）
- リード品質：「大学工学部」からの問い合わせ
- CAC：$0

**学び**: 認知不足。大学メーリングリスト戦略が必要

## 🎯 仮説 #2「AI チャット」の評価

仮説 #2（AI チャット）は **まだテスト中** だが、
前週の仮説 #1 との **デルタを見ると**:

- 前週「矛盾図表示のみ」：理解度 50% → 58%（+8pp）
- ユーザーフィードバック：「説明が足りない」

仮説 #2「チャット追加」により：
- **期待効果**：理解度 58% → 70%（+12pp）
- **テスト対象**：来週中に検証完了予定

## 💡 気づき＆提案

### 1. B2C セグメントが強い
- Twitter 投稿の「AI + TRIZ 初心者ガイド」が刺さっている
- **提案**：Twitter 施策を週 3 本に増加？

### 2. B2B2C の認知が不足
- 1 件のリードが来たが、まだ少ない
- **提案**：「大学向けウェビナー」を企画？

### 3. 理解度スコアが 58% で停滞
- チャット機能が本当に効くか、要確認
- **提案**：仮説 #2 のテスト結果で判定

## 🚀 来週への提案（CEO 用）

**Priority 1: 仮説 #2「AI チャット」のテスト結果を待つ**
- 来週金曜に理解度 70% を達成できるか検証
- 失敗したら：仮説 #3「セグメント別ガイダンス」へ

**Priority 2: B2C セグメント強化を検討**
- Twitter スレッドの効果が実証されている
- 「LinkedIn のハイターゲット化」より「Twitter 深掘り」が効果的？

**Priority 3: B2B2C の認知拡大**
- 「大学向けウェビナー」の企画を検討
- Engineer 時間が必要になる可能性

## ❓ CEO への質問

1. B2C 優先度を上げるべきですか？（Twitter スレッド週 3 本）
2. B2B2C 向けウェビナーの開催時期は？
3. 仮説 #2 が失敗した場合、仮説 #3 へ即座に進むべき？
```

---

## 🔄 **Shared Knowledge Base（全エージェント共有）**

すべてのエージェントが参照・更新するファイル構造：

```
GitHub: github.com/yourname/triz-app/

├── docs/
│   ├── product-spec.md（Product Agent が更新）
│   │   - 仮説リスト（#1～#N）
│   │   - テスト結果
│   │   - 学び
│   │
│   ├── api-schema.md（Engineer Agent が更新）
│   │   - API エンドポイント仕様
│   │   - Claude Prompt
│   │   - デプロイ情報
│   │
│   ├── marketing-strategy.md（Marketing Agent が更新）
│   │   - セグメント別 CAC
│   │   - コンテンツカレンダー
│   │   - リード源の分析
│   │
│   └── weekly-reports.md（Analytics Agent が更新）
│       - 週報（毎金曜）
│       - KPI 推移
│       - 次週提案
│
├── src/（実装コード）
│   ├── components/
│   ├── api/
│   └── utils/
│
└── data/
    ├── users.csv（Supabase から定期エクスポート）
    └── metrics.csv（Daily KPI）

Notion: https://notion.so/triz-dashboard/

├── 📊 KPI Dashboard（Analytics が毎日更新）
├── 📝 Weekly Goals（CEO が月曜に設定）
├── 🎯 Hypothesis Tracker（Product が週報で更新）
├── 🛠️ Engineering Backlog（Engineer が毎日更新）
├── 📢 Content Calendar（Marketing が週報で更新）
└── 💭 Learnings（全員が随時記入）
```

---

## 🎯 実装ステップ：最初の 4 週間

### Week 1: セットアップ
```
[ ] Notion ダッシュボード作成
    - Weekly Goals
    - Hypothesis Tracker
    - KPI Dashboard
    - Learnings

[ ] GitHub リポジトリ作成
    - フォルダ構造セットアップ
    - docs/ に template ファイル配置

[ ] Supabase セットアップ
    - テーブル：users, daily_metrics, leads, hypotheses
    - 初期データ投入

[ ] Claude API キー設定
```

### Week 2～4: 運用開始
```
【Monday】
- CEO：Weekly Goals を書く（30 分）
- 各エージェント：指示を読んで計画立案

【水曜】
- 全エージェント：進捗を Notion に記入

【金曜】
- 全エージェント：週報を提出
- CEO：結果を確認 → 学びを記録

【日曜】
- Analytics：来週の提案を作成
- CEO：月曜の指示に反映
```

---

## 📋 CEO の意思決定チェックリスト

毎週月曜、この項目を確認してから指示を書いてください：

```
[ ] 前週の「できたこと」「できなかったこと」を整理した
[ ] 「なぜ失敗したのか」の仮説を立てた
[ ] 来週の優先度を「4 つのエージェント中で 1 位」決めた
[ ] 各エージェントへの「具体的な目標数字」を設定した
[ ] 「制約」（予算・時間）を明示した
[ ] 各エージェントへの「質問」を書いた
[ ] Notion に記入した
```

---

## 🔗 エージェント間通信のフロー

```
【Monday 朝】
CEO → 全エージェント
「週の目標」「優先度」「制約」「質問」

【Monday～水曜】
各エージェント → 各エージェント
「進捗共有」「相談」「ブロッカー報告」

【水曜】
全エージェント → CEO
「進捗報告」「質問への回答」

【金曜】
全エージェント → CEO
「週報」「数字」「学び」「来週提案」

【金曜～日曜】
CEO → Analytics
「結果を見ながら来週の方向を決める」

【日曜夜】
Analytics → CEO
「来週への提案」

【月曜朝】
CEO → 全エージェント
「新週の指示」（サイクル再開）
```

---

## 次のステップ

✅ **この 4 つのエージェント設定ファイルができたら**:
- GitHub に置く
- 月曜から「実運用」を開始
- あなたは「CEO」になる

❌ **うまくいかなかったら**:
- 「どのエージェントが足りなかったのか」を検証
- Prompt を修正
- 再実行
