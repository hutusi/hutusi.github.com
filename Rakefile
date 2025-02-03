require "json"
require "net/http"
require "uri"

require "dotenv"
Dotenv.load

GITHUB_OWNER = ENV["GITHUB_OWNER"]
GITHUB_REPO  = ENV["GITHUB_REPO"]
GITHUB_TOKEN = ENV["GITHUB_TOKEN"]

DISCUSSION_IDS_FILE = "assets/data/discussions.json" # 存储每篇文章的 discussion ID
COMMENTS_FILE = "assets/data/comments.json" # 存储评论数量的 JSON 文件

# GitHub GraphQL API 查询
GRAPHQL_URL = "https://api.github.com/graphql"

# 读取 discussions.json 里的 discussion ID
def load_discussion_ids
  return {} unless File.exist?(DISCUSSION_IDS_FILE)
  JSON.parse(File.read(DISCUSSION_IDS_FILE))
end

# 获取 GitHub Discussions 的评论数
def fetch_comment_count(discussion_id)
  query = <<-GRAPHQL
  {
    repository(owner: "#{GITHUB_OWNER}", name: "#{GITHUB_REPO}") {
      discussion(number: #{discussion_id}) {
        comments {
          totalCount
        }
      }
    }
  }
  GRAPHQL

  uri = URI.parse(GRAPHQL_URL)
  request = Net::HTTP::Post.new(uri)
  request["Authorization"] = "Bearer #{GITHUB_TOKEN}"
  request["Content-Type"] = "application/json"
  request.body = { query: query }.to_json

  response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
    http.request(request)
  end

  result = JSON.parse(response.body)
  puts result
  result.dig("data", "repository", "discussion", "comments", "totalCount") || 0
end

desc "获取所有文章的 GitHub Discussions 评论数并存入 JSON 文件"
task :fetch_comments do
  discussion_ids = load_discussion_ids
  comments_data = {}

  discussion_ids.each do |slug, discussion_id|
    puts "Fetching comments for #{slug}  #{discussion_id}..."
    comments_data[slug] = fetch_comment_count(discussion_id)
  end

  File.write(COMMENTS_FILE, JSON.pretty_generate(comments_data))
  puts "评论数已更新到 #{COMMENTS_FILE}"
end

# 读取 Jekyll 文章信息
def load_posts
  posts = {}
  Dir["_posts/*.md"].each do |file|
    slug = File.basename(file, ".md")
    content = File.read(file)
    title_match = content.match(/^title:\s*["']?(.*?)["']?$/i)
    title = title_match ? title_match[1] : slug
    posts[slug] = title
  end
  posts
end

# 使用 GraphQL 查询 discussions ID
def fetch_discussion_id(title)
  query = <<-GRAPHQL
  {
    repository(owner: "#{GITHUB_OWNER}", name: "#{GITHUB_REPO}") {
      discussions(first: 100) {
        nodes {
          number
          title
        }
      }
    }
  }
  GRAPHQL

  uri = URI.parse(GRAPHQL_URL)
  request = Net::HTTP::Post.new(uri)
  request["Authorization"] = "Bearer #{GITHUB_TOKEN}"
  request["Content-Type"] = "application/json"
  request.body = { query: query }.to_json

  response = Net::HTTP.start(uri.host, uri.port, use_ssl: true) do |http|
    http.request(request)
  end

  result = JSON.parse(response.body)
  discussions = result.dig("data", "repository", "discussions", "nodes") || []

  match = discussions.find { |d| d["title"] == title }
  match ? match["number"] : nil
end

desc "获取所有文章的 Discussions ID 并存入 JSON 文件"
task :fetch_discussions do
  posts = load_posts
  discussions_data = {}

  posts.each do |slug, title|
    key = "articles/" + slug.sub(/^\d{4}-\d{2}-\d{2}-/, '')
    puts "Fetching Discussion ID for: #{key} #{title}..."
    # discussion_id = ''
    discussion_id = fetch_discussion_id(key)
    discussions_data[key] = discussion_id if discussion_id
  end

  File.write(DISCUSSION_IDS_FILE, JSON.pretty_generate(discussions_data))
  puts "所有 Discussions ID 已更新到 #{DISCUSSION_IDS_FILE}"
end
