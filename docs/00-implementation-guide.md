# TRIZアプリ AIエージェント組織：実装ガイド
## あなたがこれからやることの全体マップ

---

## 🎯 全体像

```
あなた（CEO）
    ↓
    ├── Marketing Agent（CAE）→ ユーザー獲得
    ├── Product Agent（PAE）→ 仮説検証
    ├── Engineer Agent（ENG）→ 実装
    └── Analytics Agent（ANAE）→ 判断支援
    
すべてが GitHub + Notion で 統合
```

---

## 📅 実装スケジュール

### **Week 0（今週）: セットアップ**

**所要時間：4～6 時間**

#### Day 1-2: 環境構築

```
【あなたがやること】

1. GitHub リポジトリを作成
   - 名前：triz-app
   - 公開 / Private：Private （後で Public に）

2. フォルダ構造を作る
   ```
   triz-app/
   ├── docs/
   │   ├── 01-marketing-agent.md（ダウンロード済み）
   │   ├── 02-product-agent.md（ダウンロード済み）
   │   ├── 03-engineer-agent.md（ダウンロード済み）
   │   └── 04-ceo-analytics-agent.md（ダウンロード済み）
   ├── src/
   │   ├── components/
   │   └── api/
   ├── data/
   └── README.md
   ```

3. Google Antigravity で React プロジェクトを初期化
   - 既存テンプレートから "Vite + React" を選択
   - GitHub と連携

4. Notion ワークスペースを作成
   - 「TRIZ App Dashboard」という Database を作成
   - 以下のテンプレートを作成：
     - Weekly Goals（週間目標）
     - Hypothesis Tracker（仮説ログ）
     - Content Calendar（コンテンツ企画）
     - Lead Management（リード管理）
     - Engineering Backlog（実装タスク）
     - KPI Dashboard（数字）
     - Learnings（学び）

5. Supabase アカウントを作成
   - 以下のテーブルを作成：
     ```
     users（ユーザー）
     - id, email, segment（B2C/B2B/B2B2C）, created_at
     
     daily_metrics（日次メトリクス）
     - date, dau, new_users, analyses, avg_comprehension, leads
     
     hypotheses（仮説ログ）
     - id, name, status, pre_score, post_score, learnings
     
     leads（リード）
     - id, email, segment, timestamp, responded
     ```

6. Claude API キーを設定
   - 環境変数 `CLAUDE_API_KEY` に設定
   - テスト実行：Python で簡単なクエリを送ってみる

#### Day 3: Prompt Templates を整理

```
【作業】

上記の 4 つのエージェント定義ファイルを
GitHub の `docs/` フォルダに保存

毎日チェック：
- docs/01-marketing-agent.md
- docs/02-product-agent.md
- docs/03-engineer-agent.md
- docs/04-ceo-analytics-agent.md
```

#### Day 4: Notion ダッシュボードのセットアップ

```
【Notion の初期化】

1. Database を作成：「Weekly Goals」
   - 名前、期間、優先度（1～4）、対象エージェント

2. Database を作成：「Hypothesis Tracker」
   - ID、名前、状態（待機/進行中/完了）、Pre スコア、Post スコア、学び

3. Database を作成：「KPI Dashboard」
   - 日付、DAU、新規ユーザー、リード、理解度、CAC

例）あらかじめ「テンプレート」を GitHub に置く：
- template-weekly-goals.json
- template-hypothesis-tracker.json
等々
```

#### Day 5: 初期テスト実行

```
【テスト】

1. Claude API でシンプルな Prompt を実行
   ```python
   client = anthropic.Anthropic()
   message = client.messages.create(
       model="claude-opus-4-20250514",
       max_tokens=100,
       messages=[{"role": "user", "content": "こんにちは。あなたは TRIZ マーケティングエージェントです。"}]
   )
   print(message.content[0].text)
   ```

2. Google Antigravity で「Hello World」React を作成
   - デプロイ URL を確認

3. Supabase にダミーデータを投入
   - users テーブルに 3 行
   - daily_metrics に 7 行（1 週間分）

4. Notion で「KPI Dashboard」を手動で更新
   - ダミーデータを見やすく表示

結果：すべてが動いていることを確認
```

---

## ⚡ **Week 1: 実運用開始**

### **Monday 朝（1 時間）**

#### 🔴 CEO の朝礼：週間目標設定

```
【Monday 9:00 開始】

Step 1: 環境の準備（5 分）
- Notion を開く
- GitHub を開く
- Claude AI（またはこのチャット）を開く

Step 2: 前週の結果を見る（5 分）
- Notion の「KPI Dashboard」を見る
- 「成功した施策」「失敗した施策」をメモ

Step 3: 今週の目標を書く（20 分）
- docs/04-ceo-analytics-agent.md の「Monday 指示テンプレート」を使用
- Notion の「Weekly Goals」に記入
  
  例）
  - Priority 1: Marketing Agent → リード 3 件以上獲得
  - Priority 2: Product Agent → 仮説 #1 のテスト実施
  - Priority 3: Engineer Agent → 矛盾図 UI デプロイ
  - Priority 4: Analytics Agent → KPI 監視

Step 4: 各エージェントに指示を送る（10 分）
- Notion ページを 4 つのエージェント（Claude）に見せる
- 「以下が今週の指示です。理解しましたか？」と確認

Step 5: あなたのスケジュールに「月曜指示」を記録（5 分）
- 来週月曜の「朝に何をするか」をカレンダーに記入
```

### **Monday～Thursday: 各エージェントの実行**

#### Marketing Agent が実行すること

```
【Marketing Agent の活動】

Monday 10:00:
- CEO の指示を読む
- 「今週のテーマ」を決める
  例）B2C 向け：「AI + TRIZ」キーワード
      B2B 向け：「製造業」の事例
      B2B2C 向け：「大学」向けメッセージ

Tuesday 9:00:
- コンテンツを 1 本書く（Claude Code で自動生成）
  → Qiita/Twitter/LinkedIn に投稿（手動 or 自動予約）

Wednesday 14:00:
- 「リード来た？」を確認
- 自動返信テンプレートで返信（自動化）
- Notion の「Lead Management」に記入

Thursday:
- コンテンツ 1 本追加投稿

Friday 16:00:
- 週報を作成（数字を集計）
- CEO に送信

【你（CEO）の確認タスク】
- Wednesday 昼：リード来たか確認（1 分）
- Friday 夕方：週報をざっと見る（5 分）
```

#### Product Agent が実行すること

```
【Product Agent の活動】

Monday 11:00:
- CEO の指示を読む
- 仮説 #1 の詳細テスト計画を立てる
- 仮説書を Notion に記入

Tuesday 10:00:
- Engineer Agent に「矛盾図 UI」の仕事依頼書を送る
- テスト手順書を完成させる

Wednesday 14:00:
- Engineer に「進捗は？木曜デプロイできる？」と確認

Thursday 10:00:
- Engineer が実装した「矛盾図 UI」を見る（テスト環境 URL）
- 動作確認

Thursday 15:00:
- ユーザーテスト 5 名を実施（1 人 30 分 × 5 = 2.5 時間）
- スコアを記入

Friday 16:00:
- テスト結果をまとめる
- 学びを記録
- 仮説 #2 への提案をまとめる

【あなた（CEO）の確認タスク】
- Wednesday 午前：Notion で Product の進捗を見る（2 分）
- Friday 夕方：テスト結果を見る（10 分）
```

#### Engineer Agent が実行すること

```
【Engineer Agent の活動】

Monday 13:00:
- CEO の指示を読む
- Product Agent の仕事依頼書を待つ

Tuesday 10:00 (Product から仕事依頼来た)
- タスク分解：「矛盾図 UI」を実装パートに分ける
  - API Prompt 作成（1.5h）
  - React UI 実装（2h）
  - テスト（1h）
  - デプロイ（0.5h）
- Notion の「Engineering Backlog」に記入

Tuesday 13:00:
- Claude Code で API Prompt を書く
  - Python スクリプト
  - Supabase 連携

Wednesday 10:00:
- Claude Code で React コンポーネントを書く
  - ContradictionUI.jsx
  - スタイリング（Tailwind）

Wednesday 15:00:
- ローカルでテスト
- 5 ケースを確認

Thursday 10:00:
- Google Antigravity へプッシュ
- デプロイ確認
- テスト環境 URL を Product に送信

Thursday 16:00:
- パフォーマンステスト
- 既知の制限事項をドキュメント化

Friday 16:00:
- 週報を作成
- 工数実績を記入
- 来週の推定工数を記入

【あなた（CEO）の確認タスク】
- Thursday 昼：デプロイできたか確認（1 分）
- Friday 夕方：週報で「何ができた」を見る（5 分）
```

#### Analytics Agent が実行すること

```
【Analytics Agent の活動】

Monday～Thursday:
- 毎日 KPI を追跡（自動化）
- Notion の「KPI Dashboard」に毎日値を入力
  - DAU
  - 新規ユーザー
  - リード数
  - 理解度スコア
  - CAC

Friday 14:00:
- 週報を作成（Claude Code で自動化）
  - KPI サマリー
  - セグメント別分析
  - 前週比較
  - 気づき
  - 来週提案

Friday 17:00:
- CEO に週報を送信

【あなた（CEO）の確認タスク】
- 毎日朝：KPI Dashboard をざっと見る（2 分）
- Friday 夕方：週報を詳しく読む（15 分）
```

### **Friday 夕方（1.5 時間）**

#### 🎯 CEO の週末タスク：学びの記録＆来週準備

```
【Friday 16:00～17:30】

Step 1: 全エージェントから週報を受け取る（5 分）
- Marketing：リード数、CAC
- Product：テスト結果、スコア、学び
- Engineer：実装完了、工数、ブロッカー
- Analytics：KPI、提案

Step 2: 「成功したこと」「失敗したこと」を記録（10 分）
- Notion の「Learnings」ページに記入
- 例）「Twitter スレッドが効いた」「矛盾図表示は理解度 8% 向上」

Step 3: 来週への気づき＆仮説を立てる（20 分）
- 「なぜ失敗したのか」を考える
- 「何が効いたのか」をメモ
- 「来週の優先度は何か」を決める

Step 4: 日曜夜、来週月曜の指示案を大まかに考える（15 分）
- Analytics の提案を読む
- 月曜朝に「詳細な指示」を書くため、下書きする

結果：月曜朝に「すぐに指示が書ける」状態に
```

---

## 💡 **重要：AI エージェント組織で成功するコツ**

### ✅ **やるべきこと**

```
1. 毎週月曜朝「30 分」の時間を確保
   - 絶対に短縮しない
   - 「目標を曖昧にする」→ エージェントが空回り

2. Notion と GitHub を「唯一の情報源」にする
   - メール、Slack は使わない
   - エージェント間の通信もそこに記録

3. 「失敗を記録する」ことを大事にする
   - 「仮説 #1 失敗」は「学習の証拠」
   - 「成功まで繰り返す」

4. Friday の週報を「絶対に読む」
   - データから判断する癖をつける
   - 「勘」で意思決定しない

5. 月 1 回（月末）「大きな振り返り」をする
   - 「今月のテーマは何だったか」
   - 「ユーザーが増えているか」「満足度は上がってるか」
```

### ❌ **してはいけないこと**

```
1. 「エージェントに細かい指示」をメールで送る
   → Prompt が複雑になり、エージェントが混乱

2. 「目標を毎日変える」
   → 1 週間単位で判断する

3. 「KPI を見ずに判断する」
   → 「勘」で優先度を変える → 失敗の繰り返し

4. 「エージェント間の通信を監視しすぎ」
   → 信頼できなくなる → 実装が遅れる

5. 「実装してから考える」
   → 必ず仮説を立ててからテスト環境で検証
```

---

## 📊 **Success Metrics（成功の定義）**

### **Month 1（4 週間）**

```
Goal（目標）:
- DAU：100 人（Week 4）
- 新規ユーザー：100 人
- リード（B2B）：10 件
- 理解度スコア：70% 以上

Milestone（マイルストーン）:
- Week 1: 仮説 #1 テスト完了、矛盾図 UI デプロイ
- Week 2: リード 5 件、新規ユーザー 50 人
- Week 3: 仮説 #2「AI チャット」実装
- Week 4: 理解度 70% 達成 → MVP 完成
```

### **Month 2～3（Pre-Launch 準備）**

```
- B2B営業活動開始（リード → デモ → 契約）
- B2B2C 向けウェビナー開催
- セグメント別機能を作り分け
- ユーザーレビュー（証言）を集める
```

### **Month 4+（Launch + Growth）**

```
- Product Hunt へ投稿
- リード 100 件以上
- B2B 企業 5 社のデモ
- ファウンダー向けメディアに記事
```

---

## 🚀 **あなたが今週（Week 0）にやること（最終チェックリスト）**

```
【Monday】
[ ] GitHub にリポジトリを作成
[ ] Google Antigravity で React プロジェクトを初期化
[ ] Notion アカウントを作成

【Tuesday】
[ ] 4 つのエージェント Prompt Template を docs/ に保存
[ ] Supabase でテーブルを作成
[ ] Notion ダッシュボードの基本構造を作る

【Wednesday】
[ ] Claude API キー を設定してテスト実行
[ ] Notion で「Weekly Goals」テンプレートを作る
[ ] GitHub で「フォルダ構造」を整理

【Thursday】
[ ] Google Antigravity で簡単な React アプリをデプロイ
[ ] Supabase にダミーデータを投入
[ ] Notion Dashboard に初期データを入力

【Friday】
[ ] 全環境が動いていることを確認
[ ] 月曜朝に「指示を書く」シミュレーションをしてみる
[ ] このガイドを再度読んで理解を深める

【Weekend】
[ ] 月曜朝の「指示テンプレート」の下書きを作る
[ ] 緊張を少しほぐす 😄
```

---

## 📞 **トラブルシューティング**

### Q: Google Antigravity が何か分からない
**A**: Google Antigravity = Googleが提供するノーコード Web ビルダー。React アプリを自動生成・デプロイできます。実装が難しければ、Vercel などに変更してください。

### Q: Claude Code って何？
**A**: Claude が Python / JavaScript を書いて、実行結果を返してくれるツール。あなたが「API Prompt を書いて」と指示すると、Claude が完全なコード（実行可能）を返します。

### Q: Supabase が難しい
**A**: PostgreSQL ベースのデータベース。最初は「CSV で管理」でも OK。month 2 で本格化させても大丈夫。

### Q: 月曜朝、指示を書くのに 30 分では足りない
**A**: 最初は 1 時間でいいです。3 週間経つと「どこを見て」「何を決めるか」が手に馴染んで、30 分になります。

### Q: エージェント（Claude）の指示忘れた
**A**: 毎回「docs/ のテンプレートを見せてから指示」で OK。同じ Prompt を毎週使い回します。

---

## ✨ **最後に**

> あなたは、これからエンジニアではなく **CEO** になります。
> 
> - コードは Claude が書く
> - デザインは Google Antigravity が生成する
> - データ分析は Claude がやる
> 
> あなたがやることは：
> - 「何をテストするか」を決める
> - 「データを見て判断する」
> - 「次の 1 週間の目標」を書く
> 
> これだけ。

実装量は **少ない** が、判断は **毎週** 必要。

月曜朝 30 分の習慣があれば、2 年で **ユニコーン企業** になります。

---

頑張ってください。上手くいったら、その後のステップをお手伝いします。

質問あれば、いつでも聞いてください。
