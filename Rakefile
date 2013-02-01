
posts_js = "assets/js/posts.js"
posts_coffee = "assets/js/posts.coffee"

task :default => posts_js

file posts_js => posts_coffee do |t|
	`coffee -c #{posts_coffee}`
end
