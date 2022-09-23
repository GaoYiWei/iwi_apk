<template>
    <div>
        <button @click="post">post</button>
        <button @click="get">get</button>
        <button @click="del">del</button>
        <button @click="patch">patch</button>
        <button @click="update">update</button>
    </div>

</template>

<script>

export default {
    mounted() {
    },
    methods : {
        post() {
            this.$axios({
                method: 'POST',
                url: '/api/disassemb',
                data: [[{id:'0000000001',pn:'ABCD01234',created:'iwi',createdat:'2020-9-1 17:00:00'}],[{id:'0000000001',cpn:"ABCD01235",qty:3},{id:'0000000001',cpn:"ABCD01236",qty:4}]]
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        get() {
            this.$axios({
                method: 'GET',
                url: '/api/disassemb',
                params: {id:'0000000001'}
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        del() {
            this.$axios({
                method: 'DELETE',
                url: '/api/disassemb',
                params: {id:'0000000001'}
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        patch() {
            this.$axios({
                method: 'PATCH',
                url: '/api/disassemb',
                params: { w: { id:'0000000001' }, v: { audited:'gao', auditedat:'2020-9-1 18:00:00' } }
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        },
        update() {
            this.$axios({
                method: 'PUT',
                url: '/api/disassemb',
                data: [[{id:'0000000001',pn:'ABCD01234',created:'iwi',createdat:'2020-9-1 17:00:00',"edited": "iwi","editedat": "2020-09-01 17:00:00"}],[{id:'0000000001',cpn:"ABCD01235",qty:16},{id:'0000000001',cpn:"ABCD01237",qty:16}]]
            }).then(res => {
                console.log(res)
            }).catch(err => {
                console.log(err)
            })
        }
    }
}
</script>
