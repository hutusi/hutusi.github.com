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


# 使用 GraphQL 查询 discussions ID
desc "获取所有的 Discussions count 并存入 JSON 文件"
task :fetch_discussion_comments do
  owner = GITHUB_OWNER
  repo  = GITHUB_REPO
  token = GITHUB_TOKEN
  out   = COMMENTS_FILE
  
  abort "请先设置 GITHUB_OWNER 和 GITHUB_REPO 环境变量" if owner.nil? || owner.strip.empty? || repo.nil? || repo.strip.empty?
  abort "请先设置 GITHUB_TOKEN 环境变量" if token.nil? || token.strip.empty?
  
  puts "Start to fetch, GITHUB_OWNER=#{owner}, GITHUB_REPO=#{repo}"
  endpoint = URI.parse("https://api.github.com/graphql")

  query = <<~GRAPHQL
    query($owner: String!, $name: String!, $after: String) {
      repository(owner: $owner, name: $name) {
        discussions(first: 100, after: $after, orderBy: {field: CREATED_AT, direction: ASC}) {
          nodes {
            number
            title
            comments { totalCount }
          }
          pageInfo {
            hasNextPage
            endCursor
          }
        }
      }
    }
  GRAPHQL

  results = {}   # => { "标题" => 评论总数 }
  after = nil
  total_fetched = 0

  loop do
    payload = { query: query, variables: { owner: owner, name: repo, after: after } }

    req = Net::HTTP::Post.new(endpoint)
    req["Authorization"] = "Bearer #{token}"
    req["Content-Type"]  = "application/json"
    req["Accept"]        = "application/vnd.github+json"
    req.body = JSON.dump(payload)

    res = Net::HTTP.start(endpoint.host, endpoint.port, use_ssl: true) { |http| http.request(req) }
    abort "GitHub GraphQL 请求失败：HTTP #{res.code} #{res.message}\n#{res.body}" unless res.is_a?(Net::HTTPSuccess)

    body = JSON.parse(res.body)
    abort "GraphQL 返回错误：#{JSON.pretty_generate(body["errors"])}" if body["errors"]

    repo_obj = body.dig("data", "repository") or abort "未找到仓库 #{owner}/#{repo}，请检查仓库名或权限。"

    nodes = repo_obj.dig("discussions", "nodes") || []
    nodes.each do |d|
      key = d["title"].to_s.strip
      # if results.key?(key)
      #   # 标题重复时，使用 "标题 (#编号)" 作为键，避免覆盖
      #   key = "#{key} (##{d["number"]})"
      # end
      results[key] = d.dig("comments", "totalCount")
    end
    total_fetched += nodes.size

    page = repo_obj.dig("discussions", "pageInfo")
    break unless page && page["hasNextPage"]
    after = page["endCursor"]
  end

  # 确保输出目录存在
  dir = File.dirname(out)
  Dir.mkdir(dir) unless dir == "." || Dir.exist?(dir)

  File.write(out, JSON.pretty_generate(results))
  puts "✅ 已写入 #{results.size} 条记录到 #{out}（实际抓取 discussions 数：#{total_fetched}）"
end

### ---------------------------------------------------------
# 下面的代码是旧版的，使用 GraphQL API 来获取 Discussions ID 和评论数
# 仅供参考和备份
### ---------------------------------------------------------

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
    count = fetch_comment_count(discussion_id)
    comments_data[slug] = count
    puts "Fetched #{count} comments for #{slug} #{discussion_id}."
  end

  File.write(COMMENTS_FILE, JSON.pretty_generate(comments_data))
  puts "评论数已更新到 #{COMMENTS_FILE}"
end

def read_title(file)
  slug = File.basename(file, ".md")
  slug = slug.sub(/^\d{4}-\d{2}-\d{2}-/, '')
  content = File.read(file)
  title_match = content.match(/^title:\s*["']?(.*?)["']?$/i)
  title = title_match ? title_match[1] : slug
  return slug, title
end

# 读取 Jekyll 文章信息
def load_posts
  posts = {}
  Dir["_posts/*.md"].each do |file|
    slug, title = read_title file
    posts["articles/"+slug] = title
  end
  Dir["_weeklies/*.md"].each do |file|
    slug, title = read_title file
    posts["articles/"+slug] = title
  end
  Dir["_pages/*.md"].each do |file|
    slug, title = read_title file
    posts[slug+"/"] = title
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

  puts "Start to fetch, GITHUB_OWNER=#{GITHUB_OWNER}, GITHUB_REPO=#{GITHUB_REPO}"

  posts.each do |slug, title|
    # discussion_id = ''
    discussion_id = fetch_discussion_id(slug)
    discussions_data[slug] = discussion_id if discussion_id
    puts "Fetched Discussion ID #{discussion_id} for: #{slug} #{title}."
  end

  File.write(DISCUSSION_IDS_FILE, JSON.pretty_generate(discussions_data))
  puts "所有 Discussions ID 已更新到 #{DISCUSSION_IDS_FILE}"
end

