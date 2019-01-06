import { Component, OnInit } from '@angular/core';
<% if(i18n){%>
    import {TranslateService} from '@ngx-translate/core';
<%}%>
@Component({
    selector: '<%=dasherize(name)%>',
    templateUrl: './<%=dasherize(name)%>.component.html',
    styleUrls: ['./<%=dasherize(name)%>.component.css']
})
export class <%= classify(name) %>Component {
    <% if(i18n){%>
        constructor(
            private _translate: TranslateService 
        ){}
    
        setLanguage(lang:string){
            this._translate.use(lang);
        }
    <%}%>
}