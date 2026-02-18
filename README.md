# Qiita MCP Server

Qiita API v2 の全機能 (68 ツール) を MCP (Model Context Protocol) 経由で AI から操作できる stdio サーバーです。

## クイックスタート

### 1. アクセストークンの取得

[Qiita の設定ページ](https://qiita.com/settings/applications) でアクセストークンを発行してください。

### 2. Claude Desktop で使う

`claude_desktop_config.json` に以下を追加するだけ:

```json
{
  "mcpServers": {
    "qiita-mcp": {
      "command": "npx",
      "args": ["-y", "@sunu-py-jp/qiita-mcp"],
      "env": {
        "QIITA_ACCESS_TOKEN": "your_token_here"
      }
    }
  }
}
```

> **設定ファイルの場所**
> - macOS: `~/Library/Application Support/Claude/claude_desktop_config.json`
> - Windows: `%APPDATA%\Claude\claude_desktop_config.json`

### 3. Claude Code で使う

```bash
claude mcp add qiita -e QIITA_ACCESS_TOKEN=your_token -- npx -y @sunu-py-jp/qiita-mcp
```

### 4. その他の MCP クライアント

```bash
# npx で直接起動 (インストール不要)
QIITA_ACCESS_TOKEN=your_token npx -y @sunu-py-jp/qiita-mcp

# またはグローバルインストール
npm install -g @sunu-py-jp/qiita-mcp
QIITA_ACCESS_TOKEN=your_token qiita-mcp
```

## Qiita Team での利用

Qiita Team で使用する場合は `QIITA_BASE_URL` 環境変数を追加してください:

```json
{
  "mcpServers": {
    "qiita": {
      "command": "npx",
      "args": ["-y", "@sunu-py-jp/qiita-mcp"],
      "env": {
        "QIITA_ACCESS_TOKEN": "your_token_here",
        "QIITA_BASE_URL": "https://your-team.qiita.com"
      }
    }
  }
}
```

## 提供ツール一覧 (68 tools)

### 認証 (auth) - 4 tools
| ツール | 説明 |
|--------|------|
| `create_access_token` | アクセストークンを作成 |
| `delete_access_token` | アクセストークンを無効化 |
| `create_team_access_token` | チーム用アクセストークンを作成 |
| `delete_team_access_token` | チーム用アクセストークンを無効化 |

### 認証ユーザー (authenticated-user) - 2 tools
| ツール | 説明 |
|--------|------|
| `get_authenticated_user` | 認証ユーザーの情報を取得 |
| `list_authenticated_user_items` | 認証ユーザーの記事一覧を取得 |

### 記事 (items) - 11 tools
| ツール | 説明 |
|--------|------|
| `list_items` | 記事一覧を取得 (検索クエリ対応) |
| `get_item` | 記事を ID で取得 |
| `create_item` | 記事を作成 |
| `update_item` | 記事を更新 |
| `delete_item` | 記事を削除 |
| `list_user_items` | ユーザーの記事一覧を取得 |
| `list_user_stocks` | ユーザーのストック一覧を取得 |
| `list_item_stockers` | 記事をストックしたユーザー一覧を取得 |
| `stock_item` | 記事をストック |
| `unstock_item` | 記事のストックを解除 |
| `import_item` | 記事をインポート (Team 管理者のみ) |

### コメント (comments) - 6 tools
| ツール | 説明 |
|--------|------|
| `list_item_comments` | 記事のコメント一覧を取得 |
| `create_comment` | コメントを投稿 |
| `get_comment` | コメントを取得 |
| `update_comment` | コメントを更新 |
| `delete_comment` | コメントを削除 |
| `import_comment` | コメントをインポート (Team 管理者のみ) |

### タグ (tags) - 8 tools
| ツール | 説明 |
|--------|------|
| `list_tags` | タグ一覧を取得 |
| `get_tag` | タグ詳細を取得 |
| `list_tag_items` | タグが付いた記事一覧を取得 |
| `list_user_following_tags` | ユーザーがフォロー中のタグ一覧を取得 |
| `follow_tag` | タグをフォロー |
| `unfollow_tag` | タグのフォローを解除 |
| `create_tagging` | 記事にタグを追加 (Team のみ) |
| `delete_tagging` | 記事からタグを削除 (Team のみ) |

### ユーザー (users) - 9 tools
| ツール | 説明 |
|--------|------|
| `list_users` | ユーザー一覧を取得 |
| `get_user` | ユーザー情報を取得 |
| `list_user_followees` | フォロー中のユーザー一覧を取得 |
| `list_user_followers` | フォロワー一覧を取得 |
| `follow_user` | ユーザーをフォロー |
| `unfollow_user` | ユーザーのフォローを解除 |
| `check_user_following` | フォロー状態を確認 |
| `list_item_likes` | 記事のいいね一覧を取得 |
| `check_item_stock` | 記事のストック状態を確認 |

### リアクション (reactions) - 7 tools
| ツール | 説明 |
|--------|------|
| `create_item_reaction` | 記事に絵文字リアクションを追加 |
| `list_item_reactions` | 記事のリアクション一覧を取得 |
| `delete_item_reaction` | 記事のリアクションを削除 |
| `create_comment_reaction` | コメントに絵文字リアクションを追加 |
| `list_comment_reactions` | コメントのリアクション一覧を取得 |
| `delete_comment_reaction` | コメントのリアクションを削除 |
| `create_project_comment_reaction` | プロジェクトコメントにリアクションを追加 |

### チーム (teams) - 6 tools
| ツール | 説明 |
|--------|------|
| `list_teams` | 所属チーム一覧を取得 |
| `list_team_memberships` | チームメンバー一覧を取得 |
| `list_team_invitations` | チーム招待一覧を取得 |
| `create_team_invitation` | チームに招待 |
| `delete_team_invitation` | チーム招待を取り消し |
| `remove_team_member` | チームメンバーを削除 |

### グループ (groups) - 9 tools
| ツール | 説明 |
|--------|------|
| `list_groups` | グループ一覧を取得 |
| `create_group` | グループを作成 |
| `get_group` | グループ詳細を取得 |
| `update_group` | グループを更新 |
| `delete_group` | グループを削除 |
| `list_group_members` | グループメンバー一覧を取得 |
| `add_group_member` | グループにメンバーを追加 |
| `remove_group_member` | グループからメンバーを削除 |
| `get_group_member` | グループメンバー情報を取得 |

### テンプレート (templates) - 6 tools
| ツール | 説明 |
|--------|------|
| `list_templates` | テンプレート一覧を取得 |
| `create_template` | テンプレートを作成 |
| `get_template` | テンプレートを取得 |
| `update_template` | テンプレートを更新 |
| `delete_template` | テンプレートを削除 |
| `expand_template` | テンプレート変数を展開 |

## 開発

```bash
git clone https://github.com/sunu-py-jp/Qiita-MCP.git
cd Qiita-MCP
npm install
npm run build
```

## ライセンス

[MIT](LICENSE)
