SELECT *
FROM role
JOIN department ON role.department_id = department.id;