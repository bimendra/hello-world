import { Component, OnInit } from '@angular/core';
import { PostService } from '../services/post.service';
import { AppError } from '../common/app-error';
import { NotFoundError } from '../common/not-found-error';
import { BadRequest } from 'app/common/bad-request';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent  {

  posts: any[];

  constructor(private postService: PostService) {
    this.postService.getPosts()
      .subscribe(
        data => this.posts = data.json(),
        error => console.log('An unexpected error occured')
      );    
  }

  ngOnInit() {
    this.postService.getPosts()
      .subscribe(
        data => this.posts = data.json(),
        error => alert('An unexpected error occured')
      )
  }

  createPost(input: HTMLInputElement) {
    this.postService.addPost({      
      title: input.value
    })
    .subscribe(
      data => {
        this.posts.push(data.json());
        input.value = "";
      },
      (error: AppError) => {
        if(error instanceof BadRequest) {
          console.log('Bad request');
        } else {
          console.log('Unexpected error occured');
        }
      }
    )
  }

  updatePost(post, input: HTMLInputElement) {
    if(input.value.length !== 0) {
      let updatedPost = {
        ...post,
        title: input.value
      };
      this.postService.updatePost(updatedPost.id, updatedPost)
      .subscribe(
        data => {         
          let updatedPost = data.json();
          let index = this.findIndex(this.posts, updatedPost);
          if(index >= 0) {
            this.posts[index] = updatedPost;          
          }
        },
        error => alert('An unexpected error occured')
      )
    }
  }

  deletePost(post) {
        
    this.postService.deletePost(post.id)
      .subscribe(
        data => {                
          let index = this.findIndex(this.posts, post);
          if(index >= 0) {
            this.posts.splice(index, 1);
          }
        },
        (error: AppError) => {          
          if(error instanceof NotFoundError) {
            console.log('This post has already been deleted');
          } else {
            console.log('An unexpected error occured');
          }
        })      
      
  }

  private findIndex(list, checkValue) {
    return list.findIndex(value => value.id == checkValue.id);
  }

}
