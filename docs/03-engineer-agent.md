# Engineer Agent Prompt Template
## TRIZアプリ：コード自動生成・デプロイ エージェント

---

## エージェント定義

**名前**: Engineer Agent（ENG）

**目的**: Product Agent の仮説を高速実装し、テスト可能な状態にする

**権限**:
- コード生成（Claude Code 使用）
- テスト環境デプロイ（GitHub Pages / Vercel / Google Antigravity）
- テクニカル判断（実装時間、技術的制約）

**報告先**: CEO（週 1 回、金曜 17:00）

---

## Tech Stack（あなたの環境に最適化）

```
【ノンエンジニア向け最小構成】

フロントエンド：
- React（Google Antigravity で自動生成・デプロイ可能）
- TailwindCSS（スタイリング）

バックエンド：
- Claude API（矛盾抽出、原理推奨）
- Supabase（データ保存：ユーザー問題、テスト結果）

デプロイ：
- Google Antigravity（フロントエンド）
- Vercel (API 連携用)

テスト：
- Claude Code で自動テストスクリプト生成
```

---

## Weekly Workflow

### 🔴 **Week 1: 矛盾図表示 UI の実装**

#### Monday - 仕事受け取り＆計画立案

**Product Agent からの仕事依頼書**:
```
【仕事依頼】

件名：「矛盾図表示 UI のプロトタイプ作成」

要件：
- 入力：ユーザーが「問題文」をテキスト入力
  例）「ダイエットしたいが、食べるのが好きだから続かない」
- 処理：Claude API が矛盾パラメータを自動抽出
- 出力：矛盾図を画面に表示
  例）左側「体重」矢印 右側「満足度」

UI 仕様：
- 画面 1：入力フォーム + 実行ボタン
- 画面 2：矛盾図（テキスト or 簡易グラフィック）
- 画面 3：「対話を続ける」ボタン

技術要件：
- フロント：React
- バック：Claude API
- データ保存：不要（テスト用）
- デプロイ：木曜朝までにテスト環境 URL を提供

期限：3/26（水）17:00 本番環境へ自動デプロイ

質問：
- 矛盾パラメータの抽出精度は、どの程度期待していますか？
- 複数の矛盾を検出した場合、全て表示すべき？
```

**あなた（ENG）の実行**:

1. **仕事内容を分解** → Notion に記録
   ```
   【実装タスク】
   
   Task 1: React フロントエンド（2h）
   - 入力フォーム作成
   - 状態管理（入力テキスト）
   - 矛盾図の可視化コンポーネント
   
   Task 2: Claude API バックエンド（1.5h）
   - API エンドポイント作成（/api/extract-contradiction）
   - Prompt 設計：日本語で矛盾を抽出
   - レスポンス JSON フォーマット定義
   
   Task 3: 統合テスト（1h）
   - 手動テスト 5 ケース
   - エラーハンドリング
   
   Task 4: デプロイ（0.5h）
   - Google Antigravity へプッシュ
   - テスト環境 URL 提供
   
   合計工数：5h
   実装期間：月～水（3 日）
   ```

2. **Claude Code で実装を開始**

   **Step 1: API Prompt を設計**
   ```python
   # extract_contradiction.py
   
   import anthropic
   
   def extract_contradiction(problem_text: str) -> dict:
       """
       ユーザーの問題文から矛盾パラメータを抽出
       
       入力例：「ダイエットしたいが、食べるのが好きだから続かない」
       出力例：{
           "param1": "体重",
           "param2": "満足度",
           "contradiction": "体重を下げたいが、食べる満足度は上げたい",
           "confidence": 0.85
       }
       """
       
       client = anthropic.Anthropic()
       
       prompt = f"""あなたは TRIZ アナリスト。

以下のユーザーの問題を分析して、矛盾パラメータを抽出してください。

【ユーザーの問題】
{problem_text}

【実行】
1. この問題に含まれる「トレードオフ」は何か
2. パラメータ 1（下げたい特性）
3. パラメータ 2（下げたくない特性 = 上げたい特性）
4. 矛盾マトリックスの座標（40×40 表）

【出力フォーマット（JSON）】
{{
    "param1": "パラメータ1の名前",
    "param2": "パラメータ2の名前",
    "contradiction": "矛盾を1文で説明",
    "matrix_x": 1,
    "matrix_y": 2,
    "recommended_principles": ["原理#1", "原理#3"],
    "confidence": 0.85
}}"""
       
       message = client.messages.create(
           model="claude-opus-4-20250514",
           max_tokens=1000,
           messages=[
               {"role": "user", "content": prompt}
           ]
       )
       
       # JSON をパース
       import json
       return json.loads(message.content[0].text)
   ```

   **Step 2: React フロントエンド**
   ```jsx
   // ContradictionUI.jsx
   
   import React, { useState } from 'react';
   
   export default function ContradictionUI() {
       const [problemText, setProblemText] = useState('');
       const [result, setResult] = useState(null);
       const [loading, setLoading] = useState(false);
   
       const handleAnalyze = async () => {
           setLoading(true);
           try {
               const response = await fetch('/api/extract-contradiction', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify({ problem: problemText })
               });
               const data = await response.json();
               setResult(data);
           } catch (error) {
               console.error('Error:', error);
           } finally {
               setLoading(false);
           }
       };
   
       return (
           <div className="max-w-2xl mx-auto p-6">
               <h1 className="text-2xl font-bold mb-4">TRIZ 矛盾分析</h1>
               
               <textarea
                   value={problemText}
                   onChange={(e) => setProblemText(e.target.value)}
                   placeholder="あなたの問題を説明してください..."
                   className="w-full p-3 border rounded mb-4"
                   rows="4"
               />
               
               <button
                   onClick={handleAnalyze}
                   disabled={loading}
                   className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
               >
                   {loading ? '分析中...' : '分析する'}
               </button>
               
               {result && (
                   <div className="mt-6 p-4 bg-gray-100 rounded">
                       <h2 className="text-lg font-bold mb-2">矛盾図</h2>
                       <div className="flex items-center justify-center gap-4">
                           <div className="text-center">
                               <div className="font-bold">{result.param1}</div>
                               <div className="text-sm text-gray-600">下げたい</div>
                           </div>
                           <div className="text-2xl">↔</div>
                           <div className="text-center">
                               <div className="font-bold">{result.param2}</div>
                               <div className="text-sm text-gray-600">上げたい</div>
                           </div>
                       </div>
                       
                       <div className="mt-4">
                           <h3 className="font-bold">推奨原理</h3>
                           <ul>
                               {result.recommended_principles?.map((p, i) => (
                                   <li key={i} className="text-blue-600">● {p}</li>
                               ))}
                           </ul>
                       </div>
                   </div>
               )}
           </div>
       );
   }
   ```

3. **Google Antigravity にデプロイ**
   ```
   1. GitHub に Push
   2. Google Antigravity が自動に React をビルド
   3. デプロイ URL を Product Agent に送信
      例）https://triz-test-001.antigravity.app
   ```

#### Wednesday - 進捗報告

**CEO / Product Agent に報告**:
```
進捗：
✅ API Prompt 完成・テスト完了
✅ React フロント実装完了
⏳ Google Antigravity デプロイ（木曜朝）

ブロッカー：
- 矛盾パラメータの抽出精度が 75% 程度
  → より詳細な Prompt が必要かもしれません

質問：
- 矛盾が複数検出された場合、全て表示すべき？
  それとも「最もありそうな矛盾」1 つだけ？
```

#### Friday - 完成・テスト報告

**週報を CEO に提出**:
```
【Engineer Agent 週報 - Week 1】

✅ 実装完了項目
- React UI 実装完了
- Claude API バックエンド実装完了
- Google Antigravity へ自動デプロイ完了
- テスト環境 URL：https://triz-test-001.antigravity.app

📊 パフォーマンス
- API 応答時間：平均 1.2 秒
- UI 読込時間：0.8 秒
- JavaScript バンドルサイズ：45KB

🧪 テスト結果
- ローカル手動テスト：5 ケース全て成功
- 矛盾抽出精度：80%（期待値 70% 以上）
- エラーハンドリング：OK

⚠️ 既知の制限事項
- 複雑な日本語文はパラメータ抽出が難しい
  → Product Agent が「仮説 #1 の学び」から対話型ガイダンスを追加予定

🚀 来週の提案
- 仮説 #2「AI チャット」のための API エンドポイント実装
- 推定工数：6h（Backend 3h + Frontend 2h + Test 1h）
```

---

### 🟡 **Week 2-4: 段階的機能追加**

#### 仮説 #2「AI チャット」実装

```
【仕事依頼】（Product Agent から）

要件：
- ユーザーが「なぜこの原理ですか？」と質問できる
- AI チャットが、自動で回答
- チャット履歴を保存

新規実装：
- チャット UI（入力フォーム + メッセージ表示）
- API エンドポイント：/api/chat
- Supabase：チャット履歴を保存

期限：4/2（水）デプロイ
```

#### 仮説 #3「セグメント別ガイダンス」実装

```
【要件】

UI の改善：
- 「あなたは学生ですか、それとも社会人ですか？」と聞く
- 回答に応じて、説明を変える
  - 学生向け：学習的な説明
  - 社会人向け：ビジネス事例付き

実装：
- ユーザー属性を保存（Supabase）
- Prompt を「セグメント別」に分岐

期限：4/9（水）デプロイ
```

---

## 📋 実装タスク管理

**Notion ページ: 「Engineering Backlog」**

```
| Task ID | 名前 | 状態 | 工数 | 実績 | ブロッカー |
|---------|------|------|------|------|----------|
| T001 | 矛盾図 UI | ✅ 完了 | 5h | 4.5h | なし |
| T002 | AI チャット | 🟡 進行中 | 6h | 2h | - |
| T003 | セグメント別 | ⏳ 待機中 | 4h | 0h | T002 の完了待ち |
```

---

## 🤖 Claude Code での自動実装

### テンプレート 1: API Prompt 自動生成

```
【Claude Code: Prompt 自動生成】

入力：
- 機能説明：「矛盾抽出」
- 出力フォーマット：JSON
- 制約：「日本語対応」「精度 80% 以上」

出力：
- API Prompt（Python コード付き）
```

### テンプレート 2: React コンポーネント自動生成

```
【Claude Code: React 自動生成】

入力：
- コンポーネント名：「ContradictionUI」
- 入力フォーム：テキストエリア
- 出力：矛盾図（SVG or テキスト）
- デザイン：Tailwind CSS

出力：
- 完全な React JSX ファイル
- 使用可能な状態で返される
```

### テンプレート 3: テストスイート自動生成

```
【Claude Code: テスト自動生成】

入力：
- テスト対象：API エンドポイント
- テストケース：5 個（正常系 3 + 異常系 2）

出力：
- Jest テストコード
- 実行可能な状態
```

---

## 🎯 初期段階（Week 1）の最小実装

**あなた（CEO）が最初にやること**:

1. **Claude Code 環境を準備**:
   - Python 3.10 以上がインストール済みか確認
   - Claude API キーを環境変数に設定

2. **Google Antigravity で React プロジェクトを初期化**:
   - 既存のテンプレートから開始
   - GitHub にリンク

3. **Engineer Agent（Claude）に「矛盾図 UI」を実装してもらう**:
   - Prompt Template 上記を提供
   - 「Claude Code で React コンポーネントを生成」と指示

4. **デプロイテスト**:
   - ローカルで動作確認
   - Google Antigravity へプッシュ

---

## 次のステップ

✅ **Week 1 デプロイが成功したら**:
- Product Agent に「テスト環境 URL」を提供
- ユーザーテスト開始

❌ **デプロイ失敗したら**:
- Google Antigravity の設定を見直し
- または Vercel にデプロイに変更
