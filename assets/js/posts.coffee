class Page
  constructor: (data, @category = "all", @paginate = 10) ->
    @posts = (post for post in data when (@category is "all" or post.category is @category ))
    @pageNum = Math.ceil(@posts.length / @paginate)
    @renderPage()
    @render(0)    
  
  renderPage: () =>
    $('div.home').append("<ul class=\"posts\"></ul>")
    $('ul.posts').after("<div class=\"pagination\"></div>")
  
  render: (pageIndex) =>
    @renderPosts(pageIndex)
    @renderPagination(pageIndex)

  renderPosts: (pageIndex) =>
    $('ul.posts').empty()
    for post in @posts[pageIndex*@paginate...(pageIndex+1)*@paginate]
      $('ul.posts').append("<li><span>#{post.date}</span> &raquo; <a href=\"#{post.url}\">#{post.title}</a></li>")
  
  renderPagination: (pageIndex) =>
    $("div.pagination").empty()
    pageList = $("<ul/>").appendTo("div.pagination")
    active = if pageIndex is 0 then "disabled" else ""
    pageList.append("<li class=\"#{active}\"><a href=\"#\" class=\"prev pagination\">&laquo;</a></li>")
    for seq in [0...@pageNum]
      active = if seq is pageIndex then "active" else ""
      pageList.append("<li class=\"#{active}\"><a href=\"#\" class=\"pagination\">#{seq+1}</a></li>")
    active = if pageIndex is @pageNum-1 then "disabled" else ""
    pageList.append("<li class=\"#{active}\"><a href=\"#\" class=\"next pagination\">&raquo;</a></li>")
    @currPageLi = $("div.pagination ul li.active:first")

  active: (obj) ->
    obj.addClass("active") unless obj.hasClass("active")

  disActive: (obj) ->
    obj.removeClass("active") if obj.hasClass("active")

  disable: (obj) ->
    obj.addClass("disabled") unless obj.hasClass("disabled")

  enable: (obj) ->
    obj.removeClass("disabled") if obj.hasClass("disabled")

  changeActive: (active, index) ->
    @disActive(@currPageLi)
    @active(active)
    @currPageLi = active
    
    @enable($("a.prev").parent())
    @enable($("a.next").parent())
    @disable($("a.prev").parent()) if index <= 0
    @disable($("a.next").parent()) if index >= @pageNum - 1

  clickPagination: (pageAnchor) =>
    return if pageAnchor.parent().is('.disabled, .active')

    if pageAnchor.hasClass("prev") 
      activeLi = @currPageLi.prev()
    else if pageAnchor.hasClass("next")
      activeLi = @currPageLi.next()
    else
      activeLi = pageAnchor.parent()
    
    activeIndex = parseInt(activeLi.children("a:first").text(), 10) - 1 
    @changeActive(activeLi, activeIndex)
    @renderPosts(activeIndex)

render = (category = "all", paginate = 10) ->
  $.getJSON '/posts.json', (data) =>
    page = new Page(data, category, paginate)
    $("a.pagination").click (eventObj) =>
      page.clickPagination $(eventObj.currentTarget)
