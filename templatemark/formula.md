Hello {{firstName}}{{#if condition="lastName.startsWith('S')"}}Mister{{else}}Dude{{/if}}!

Thank you for visiting us {{% return now.diff(lastVisit,'day') %}} days ago.