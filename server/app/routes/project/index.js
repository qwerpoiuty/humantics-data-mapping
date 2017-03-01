'use strict';
var router = require('express').Router();
var db = require('../../../db')
var Project = db.model('project')

var chalk = require('chalk')


var ensureAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.status(401).end();
    }
}

router.get('/', function(req, res) {
    db.query(`SELECT project_id, project_name, u2.email as project_leader, u1.email,members,tables,project_status,due_date FROM projects inner join users u1 on u1.id = any(projects.members) 
inner join users u2 on u2.id=projects.leader order by projects.project_id asc`)
        .then(projects => {
            res.json(projects)
        })
})

router.get('/projectByUser/:user_id', function(req, res) {
    db.query(`SELECT project_id, project_name, u2.email as project_leader, u1.email,members,tables,project_status,due_date FROM projects inner join users u1 on u1.id = any(projects.members) 
inner join users u2 on u2.id=projects.leader 
where u1.id = ${req.params.user_id} order by projects.project_id asc`)
        .then(function(projects) {
            res.json(projects)
        })
})
router.get('/projectsStatus/:user_id', function(req, res) {
    db.query(`SELECT project_id, project_name, u2.email as project_leader, u1.email,members,tables,project_status,due_date, tables.table_id, tables.table_status FROM projects inner join users u1 on u1.id = any(projects.members) inner join tables on tables.table_id = any(projects.tables) inner join users u2 on u2.id=projects.leader where u1.id = ${req.params.user_id} order by projects.project_id asc`)
        .then(projects => {
            res.json(projects)
        })
})
router.get('/projectStatsByUser/:user_id', (req, res) => {
    db.query(`select d.project_id, t.table_status from projects inner join tables t on t.table_id = any(p.tables) where user.id=${req.params.user_id}`)
        .then(function(projects) {
            res.json(projects)
        })
})


router.get('/completedMappings', (req, res) => {
    db.query(`select * from mappings inner join attributes on attributes.attr_id = mappings.target inner join tables on tables.table_id = attributes.table_id inner join schemas on schemas.schema_id = tables.schema inner join dbs on schema.db = dbs.db_id inner join projects on tables.table_id = any(project.project_id) where mappings.mapping_status = 'Approved'`)
})

router.get('/wipMappings/project_id', (req, res) => {
    db.query(`SELECT * from projects p
inner join users u
 on u.id = any(p.members)
inner join tables c
 on c.table_id = any(p.tables)
inner join attributes b
 on b.table_id = c.table_id
inner join mappings a1
 on a1.target = b.attr_id
inner join schemas d
 on d.schema_id = c.schema
inner join dbs e
 on d.db = e.db_id
WHERE a1.version = 
  (SELECT max(version) FROM mappings a2 WHERE a2.target = a1.target)
and p.project_id = ${req.params.project_id}
order by a1.date_modified`).then(mappings => {
        res.json(mappings)
    })
})

router.get('/assignedMappings', (req, res) => {
    db.query(`
select t.table_name, t.table_status ,p.project_name,t.table_id from projects p inner join users u on u.id = any(p.members) inner join tables t on t.table_id = any(p.tables) where t.table_status = '${req.query.stage}' and u.id = ${req.query.user_id}order by p.due_date`).then(assigned => {
        res.json(assigned)
    })
})

router.get('/getPermission/:user_id', (req, res) => {
    db.query(`select * from projects inner join users on users.id = any(projects.members) where ${req.query.table_id} = any(projects.tables) and users.id = ${req.params.user_id}`).then(projects => {
        if (projects[0].length > 0) res.json(true)
        else res.json(false)

    })
})

router.get('/single/:id', function(req, res) {
    // db.query(`select s.schema_name,dbs.db_name, t.table_name, t.table_id, a.attr_id,m.version from projects p inner join tables t on t.table_id = any(p.tables) inner join schemas s on t.schema = s.schema_id inner join dbs on s.db = dbs.db_id inner join attributes a on a.table_id = t.table_id full outer join (select * from mappings m1 where m1.version = (select max(version) from mappings m2 where m2.target = m1.target)) m on m.target = a.attr_id where p.project_id = ${req.params.id} order by t.table_id, attr_id`)
    db.query(`select * from projects p inner join tables t on t.table_id = any(p.tables) inner join schemas s on s.schema_id = t.schema inner join dbs d on d.db_id = s.db where p.project_id = ${req.params.id}`)
        .then(function(projects) {
            res.json(projects)
        })
})

router.post('/updateProject', (req, res) => {
    db.query(`update projects set ${req.body.column} = '{${req.body.values.join(',')}}' where projects.project_id = ${req.body.id}`).then(project => {
        res.sendStatus(200)
    })
})

router.post('/editProject', (req, res) => {
    var sets = []
    for (var i = 0; i < req.body.columns.length; i++) {
        sets.push(`${req.body.columns[i]}='${req.body.values[i]}'`)
    }

    db.query(`update projects set ${sets.join(',')} where projects.project_id = ${req.body.id}`).then(project => {
        res.sendStatus(200)
    })
})

router.post('/custom', (req, res) => {
    var string = "select * from tables inner join schemas on tables.schema = schemas.schema_id inner join dbs on schemas.db = dbs.db_id"
    if (req.body.query) string = string + " where " + req.body.query
    db.query(string).then(results => {
        res.json(results)
    })
})

router.post('/deleteProject/:project_id', (req, res) => {
    db.query(`delete from projects where projects.project_id = ${req.params.project_id}`).then(() => {
        res.sendStatus(200)
    })
})

router.post('/', function(req, res) {
    req.body.project_name = "'" + req.body.project_name + "'"
    req.body.due_date = "'" + req.body.due_date + "'"
    req.body.members = `'{${req.body.members.join(',')}}'`
    var keys = Object.keys(req.body)
    var values = []
    for (var key in req.body) {
        values.push(req.body[key])
    }
    keys = keys.join(',')
    values = values.join(',')
    db.query('insert into projects (' + keys + ') values(' + values + ')').then(function(table) {
        res.sendStatus(200)
    })
})



module.exports = router;