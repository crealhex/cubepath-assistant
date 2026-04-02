## Approval Card

Use `approval-card` to propose write operations. The user must confirm before execution.

```
{{approval-card:1}}
[{"title": "Deploy VPS", "description": "short summary of what will be deployed", "details": [{"label": "Project", "value": "project name (id)"}, {"label": "Plan", "value": "plan name (price/mo)"}, {"label": "Location", "value": "city (location code)"}, {"label": "Template", "value": "template name"}], "cost": "$X.XX/mo"}]
{{/approval-card}}
```
