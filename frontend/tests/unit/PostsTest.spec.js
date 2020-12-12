import {mount, createLocalVue} from '@vue/test-utils'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import Posts from "../../src/components/Posts.vue";
import moment from 'moment'

const localVue = createLocalVue();

localVue.use(Vuex);
localVue.use(VueRouter);

//Create dummy store
const store = new Vuex.Store({
    state: {
        user: {
            id: 1,
            firstname: 'test',
            lastname: 'test',
            email: 'test',
            avatar: 'test',
        }
    },
    getters: {
        user: (state) => state.user,
    }
});

//Create dummy routes
const routes = [
    {
        path: '/',
        name: 'posts',
    },
    {
        path: '/profiles',
        name: 'profiles'
    }
];

const router = new VueRouter({routes});

const testData = [
    {
        id: 1,
        text: "I think it's going to rain",
        createTime: "2020-12-05 13:53:23",
        likes: 0,
        liked: false,
        media: {
            url: "test-image.jpg",
            type: "image"
        },
        author: {
            id: 2,
            firstname: "Gordon",
            lastname: "Freeman",
            avatar: 'avatar.url'
        }
    },
    {
        id: 2,
        text: "Which weighs more, a pound of feathers or a pound of bricks?",
        createTime: "2020-12-05 13:53:23",
        likes: 1,
        liked: true,
        media: null,
        author: {
            id: 3,
            firstname: "Sarah",
            lastname: "Connor",
            avatar: 'avatar.url'
        }
    },
    {
        id: 4,
        text: null,
        createTime: "2020-12-05 13:53:23",
        likes: 3,
        liked: false,
        media: {
            url: "test-video.mp4",
            type: "video"
        },
        author: {
            id: 5,
            firstname: "Richard",
            lastname: "Stallman",
            avatar: 'avatar.url'
        }
    }
];

//Mock axios.get method that our Component calls in mounted event
jest.mock("axios", () => ({
    get: () => Promise.resolve({
        data: testData
    })
}));

describe('Posts', () => {

    const wrapper = mount(Posts, {router, store, localVue});

    it('1 == 1', function () {
        expect(true).toBe(true)
    });
    
//Test that exactly as many posts are rendered as contained in testData variable
it('renders the correct amount of data ', () => {

    const data = wrapper.findAll('.post')

   
    expect(data.length).toEqual(testData.length)

});

//Test that if post has media property, image or video tags are rendered depending on media.type property, 
//or if media property is absent nothing is rendered.
it('if post renders the correct amount media property ', () => {

    const media = wrapper.findAll('.post-image')
    const mediaTest = testData.filter((item) => item.media != null)

   
    expect(media.length).toEqual(mediaTest.length)

});
//Test that post create time is displayed in correct format: Saturday, December 5, 2020 1:53 PM
it('if createTime renders correct format ', () => {

    let time = wrapper.find('span + small')
    
    testData.filter((item) =>  
   
    expect(time.text()).toContain(moment(item.createTime).format('LLLL'))
   )
});
});