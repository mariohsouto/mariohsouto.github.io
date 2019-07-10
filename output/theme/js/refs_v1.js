
function doReferences() {
    var btex = bibtexParse.toJSON(bibtex);
    var cited = [];
    var citeTags = document.querySelectorAll("dt-cite");

    citeTags.forEach((el,n) => {
      var key = el.getAttribute('key');
      var btex_elem = btex.find(item => {return item.citationKey == key});
      var template = `<label for="${key}" class="margin-toggle sidenote-number"></label><input type="checkbox"
       id="${key}"
       class="margin-toggle"/><span class="sidenote">${btex_elem.entryTags.author}  (${btex_elem.entryTags.year}) <a style="text-decoration:none" href="${btex_elem.entryTags.url}">"${btex_elem.entryTags.title}"</a>. <i>${btex_elem.entryTags.journal}</i>`;
       if (btex_elem.entryTags.openaccess){
         template += ` (<a style="text-decoration:none" href="${btex_elem.entryTags.openaccess}">Open access version</a>)`;
       }
       template += `.</span>`;
      el.innerHTML = template;
      if (cited.indexOf(btex_elem) == -1) {
        cited.push(btex_elem);        
      }
    });

    var noteTags = document.querySelectorAll("dt-note");
    noteTags.forEach((el,n) => {
      var key = el.getAttribute('key');
      var text = el.innerHTML;
      var template = `<label for="${key}" class="margin-toggle sidenote-number"></label><input type="checkbox"
       id="${key}"
       class="margin-toggle"/><span class="sidenote">${text}</span>`;
      el.innerHTML = template;
    });
    
    var refs = document.getElementById("references");
    cited.sort(function(a, b){
      if (a.citationKey > b.citationKey) {
        return 1;
      }
      else if (a.citationKey < b.citationKey) {
        return -1;
      }
      return 0;});
    template = "<ul>";
    cited.forEach(function(element){
      template += `<li>${element.entryTags.author}  (${element.entryTags.year}) <a style="text-decoration:none" href="${element.entryTags.url}">"${element.entryTags.title}"</a>. <i>${element.entryTags.journal}</i></li>`;
    });
    refs.innerHTML = template + '</ul>';
  }


  function doNotes() {

    var noteTags = document.querySelectorAll("dt-note");
    noteTags.forEach((el,n) => {
      var key = el.getAttribute('key');
      var text = el.innerHTML;
      var template = `<label for="${key}" class="margin-toggle sidenote-number"></label><input type="checkbox"
       id="${key}"
       class="margin-toggle"/><span class="sidenote">${text}</span>`;
      el.innerHTML = template;
    });
  }


/*
<p class="framed">
    <b>Outline:</b><br/>
    <span style="margin-left: 20px"><a href="#intro">1. Introduction.</a></span><br/>
    <span style="margin-left: 20px"><a href="#example">2. Adaptive Three Operator Splitting.</a></span><br/>
    <span style="margin-left: 20px"><a href="#convergence">3. Adaptive Frank-Wolfe.</a></span><br/>
    <span style="margin-left: 20px"><a href="#convergence">4. Stochastic Optimization.</a></span><br/>
</p>
*/
function doTOC() {
    var template = "<p class='framed'><b>Outline:</b><br/>";
    var sections = document.querySelectorAll("h2");
    sections.forEach(function(element, i){
        var text = element.innerHTML;
        var sectTitle = `${i+1}. ${text}`;
        element.innerHTML = sectTitle;
        element.setAttribute('id', 'sec' + (i+1));
        template = template + `<span style="margin-left: 20px"><a style="text-decoration:none" href="#sec${i+1}">${sectTitle}</a></span><br/>`;
    })

    var TOC = document.getElementById("TOC")
    TOC.innerHTML = template + '</p>'
}
