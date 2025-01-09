const mongoose=require('mongoose')

const groupMessageSchema=new mongoose.Schema({
  text:{
      type:String,
      default:""
  },
  imageUrl:{
      type:String,
      default:""
  },
  videoUrl:{
      type:String,
      default:""
  },
  msgByUserID:{
      type:mongoose.Schema.ObjectId,
      required:true,
      ref:'User'
  },
  seenBy: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
},{
  timestamps:true
})


const groupChatSchema=new mongoose.Schema({
  name:{
      type:String,
      default:""
  },
  createdBy:{
      type:mongoose.Schema.ObjectId,
      required:true,
      ref:'User'
  },
  profile_pic:{
    type:String,
    default:"data:image/jpeg;base64,/9j/4AAQSkZJRgABAgEASABIAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAAZABkDAREAAhEBAxEB/8QAHwAAAQUBAQEBAQEAAAAAAAAAAAECAwQFBgcICQoL/8QAtRAAAgEDAwIEAwUFBAQAAAF9AQIDAAQRBRIhMUEGE1FhByJxFDKBkaEII0KxwRVS0fAkM2JyggkKFhcYGRolJicoKSo0NTY3ODk6Q0RFRkdISUpTVFVWV1hZWmNkZWZnaGlqc3R1dnd4eXqDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uHi4+Tl5ufo6erx8vP09fb3+Pn6/8QAHwEAAwEBAQEBAQEBAQAAAAAAAAECAwQFBgcICQoL/8QAtREAAgECBAQDBAcFBAQAAQJ3AAECAxEEBSExBhJBUQdhcRMiMoEIFEKRobHBCSMzUvAVYnLRChYkNOEl8RcYGRomJygpKjU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6goOEhYaHiImKkpOUlZaXmJmaoqOkpaanqKmqsrO0tba3uLm6wsPExcbHyMnK0tPU1dbX2Nna4uPk5ebn6Onq8vP09fb3+Pn6/9oADAMBAAIRAxEAPwD+Dz4XfC74ifGz4h+D/hN8JfBuv/EL4k+Ptcs/Dng7wZ4X0+bU9c1/Wb5iIbSytIQTtRFkubu6maKz0+xgudQv7i2sbW4uIrp051Zxp04uc5tRjGKu230S/qy1egpSUU5SaSWrb2R9K/tG/wDBOz9tX9kv4yeDPgB+0B+z54x8B/Fr4jWFpqngLwvHdeHPF8HjGxu7qWy87w54l8Da34m8J6ubG5hkj1qGy12afw/gPrsenRujt62A4ezvNM2wGRZblmKx2b5nXp4fAYDCU/b18VWqO0YUlTcou1nKpJyUKNOMqlWUKcZSXBjc1y3LcBi80zDG0MHl+BpTr4vF4iapUaFKCu5TlKz1uowik5VJuMKalOSi/EvjX+z58ZP2dPEdj4T+M/gXUvA+uanpq6vpkN3d6TqllqWntK8DT6frOgahqui3pgmQxXcFtqEtxZSGNLuKBpYw/s8a+H3GXh1mVDKeM8ixOR47FYZYvDQq1cJiqGJw7k4Oph8ZgMRi8FXdOa5K0KWInUoScY1oQcop+Vwxxhw1xngquYcM5rQzXC0K7w9eVOniKFWhWUVJQrYbF0cPiaXPF81OU6MYVYpunKSjK3jVfGn0p+zX/BB/4S/tneMP+ChHwl+Ln7F3hX4d6v4x/Z91G48WeLPEHxp1q98K/BrRvC3i/QfEPgLV9A8ZeKNN0vXNW07UvHfhzW/E+geFoPDmh6/4oS9W78RaXol3Z+GdWuLL18mwuOr4tVcDR9o8N79WUrqnCE1KFpySbTmnJRUYylpKSi1CTXJjK2HpUuWvUUPa+7BXXNKSs9E2r2dr3aWqV7yV/wCoX/gsr8Av+Cyvxf8A2pf2Q/2m9V+Cn7Jfh74Rfs2ReNdP8Of8K2+OHjL4m+HfC+o/Fay0jR/H8vxY8W+Mvg58HvHM0XjnTtD0fw74Rn8G/CPUtL8LXogN5f3Go6is0/7z4MZfx3jPFrhLGcH0uHf7ZymeYYyhSzvMZ4bLq2EeAr4fNcPWqxw08bOriMur4inSWX4HF4nD3ljPYulhq1SH5X4q4rhjD+HnEFDiWWb/ANlY6OEwtWplOEjiMbSxP1ujWwFaEJVaeGjTpY2jQnUeLxOHoVrLDOqqlelCf84f/BYPwH+1t4stvAXxR+JngH4c6T8Jfh7DfaLZzfC/xjrnjs+HtZ8aXekRXt74x1bxH4M+H2qC31m70XRtP0qW08Lpo+n3KwWFxqMmpatbLc/sH0wMh8Ws2pZDxTxLkHDmE4S4ehXwVGfDGcY7Pnl+Mzqrg4Vq2cYvMcl4exKp4yrgsHh8JOllaweHqKFCpiJYnF01U/Lfo45t4e5fPNshyPN86xHEOcSpYqrHPctwuU/XMNllPEypUstw+CzPOKHPhqeJxNbERqY94mtByqwoqjh58n4OV/B5/WJ+w3/BJv8A4KySf8EvJPj2R8BE+OMXxxT4Xh0PxQb4aSeGZPho3xD8pll/4V54/XWE1hfH8wkjMOmNYtpkbLJdC6ZYPochz7+xPrX+y/WfrPsP+X/seT2Ptv8ApzV5ub2v923L1vp5mZZb/aHsf33sfY+0/wCXftOb2nJ/fha3J53ufqn8Zf8Ag6l8V/FL4Q+K/hRpH7IWoeDIPE39g7dSP7TH/CR2Wn/2H4n0XxHlfD918AdPtLg3R0gWZIurYxC489vOEXkSfq3hv404bgDjfJeMa3CMM8WUf2lfLf7beWSxX9oZRj8q/wB/hlONlR9i8csR/u1X2nsvZe5z+0h8Xxb4ff618OZjw5VzeWFoZj9U56rwUsRGH1THYbHR/crHYdy5pYaMLqtBx5ub3uXkl+Sf7TP/AAVf8W/tJ/Arxr8D9T+E2neHrPxq3hr7T4i/4TAatd2S+G/F2g+LYhFp9v4P0KCVrm40GG0dmuIxFFcSSBZGVVP694vfS8wnil4f59wNQ8NJ8OSzx5V/wqy40ecRwscsznL83aWAfCuWus67wCw93jqapKq6vLUcPZy/O+BPo+YTgjizK+KafE1THzytY7kwX9k/VYVXjcuxeXNyryzTFyiqccXKokqUuaUFG8U21+SVfxUf0WFABQAUAFAA/9k="
  },
  members:[
    {
      type:mongoose.Schema.ObjectId,
      ref:'User'
    }
  ],
  messages:[
      {
          type:mongoose.Schema.ObjectId,
          ref:'GroupMessage'
      }
  ]
},{
  timestamps:true
})
const GroupMessageModel=mongoose.model('GroupMessage',groupMessageSchema)
const GroupChatModel=mongoose.model('GroupConversation',groupChatSchema)
module.exports={
  GroupMessageModel,
  GroupChatModel
}