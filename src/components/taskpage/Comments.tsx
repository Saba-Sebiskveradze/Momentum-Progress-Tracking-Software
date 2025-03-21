import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { createComment, getTaskComments } from "../../api/data";
import { useParams } from "react-router";
import left from "../../assets/img/left.svg";
interface CommentType {
  id: number;
  text: string;
  task_id: number;
  parent_id?: number;
  user: {
    name: string;
    avatar?: string;
  };
  created_at: string;
  replies?: CommentType[];
}
interface ApiComment {
  id: number;
  text: string;
  task_id: number;
  parent_id?: number;
  author_nickname: string;
  author_avatar?: string;
  created_at: string;
  sub_comments?: ApiComment[];
}

const Comments = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const [comments, setComments] = useState<CommentType[]>([]);
  const [commentText, setCommentText] = useState("");
  const [replyToId, setReplyToId] = useState<number | null>(null);
  const [replyText, setReplyText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchComments();
  }, [taskId]);

  const fetchComments = async () => {
    if (!taskId) return;

    try {
      setIsLoading(true);
      const taskIdNumber = parseInt(taskId, 10); 
      const data = await getTaskComments(taskIdNumber);

      const transformedComments = data.map((comment: ApiComment) => ({
        id: comment.id,
        text: comment.text,
        task_id: comment.task_id,
        parent_id: comment.parent_id,
        user: {
          name: comment.author_nickname,
          avatar: comment.author_avatar,
        },
        created_at: comment.created_at, 
        replies: comment.sub_comments?.map((reply: ApiComment) => ({
          id: reply.id,
          text: reply.text,
          task_id: reply.task_id,
          parent_id: reply.parent_id,
          user: {
            name: reply.author_nickname,
            avatar: reply.author_avatar,
          },
          created_at: reply.created_at, 
        })),
      }));

      setComments(transformedComments);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const trimmedText = commentText.trim();
    if (!trimmedText || !taskId) return;

    try {
      setIsLoading(true);
      const taskIdNumber = parseInt(taskId, 10); 
      await createComment(trimmedText, taskIdNumber);

      setCommentText("");
      await fetchComments(); 
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReplySubmit = async (e: FormEvent, parentId: number) => {
    e.preventDefault();

    const trimmedText = replyText.trim();
    if (!trimmedText || !taskId) return;

    try {
      setIsLoading(true);
      const taskIdNumber = parseInt(taskId, 10); 
      await createComment(trimmedText, taskIdNumber, parentId);

      setReplyText("");
      setReplyToId(null);
      await fetchComments(); 
    } catch (error) {
      console.error("Failed to post reply:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-[741px]  bg-[#F8F3FEA6] p-[40px] absolute top-[200px] right-[120px] border-[0.3px] border-[#DDD2FF] rounded-[10px] flex flex-col gap-[65px]">
      <form
        className="w-[651px] h-[135px] bg-[#FFFFFF] flex flex-col justify-between border-[0.3px] border-[#ADB5BD] pt-[18px] pb-[15px] px-[20px] rounded-[10px]"
        onSubmit={handleCommentSubmit}
      >
        <textarea
          placeholder="დაწერე კომენტარი"
          className="firaGO-font text-[350] text-[14px] text-[#898989] border-none resize-none outline-none"
          aria-label="Comment input"
          value={commentText}
          onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
            setCommentText(e.target.value)
          }
        ></textarea>
        <button
          type="submit"
          className={`w-[155px] h-[35px] self-end items-center justify-center firaGO-font text-[400] text-[16px] text-[#FFFFFF] rounded-[20px] ${
            commentText.trim()
              ? "bg-[#8338EC] cursor-pointer"
              : "bg-[#8338ECA6] cursor-not-allowed"
          }`}
          disabled={!commentText.trim() || isLoading}
        >
          დააკომენტარე
        </button>
      </form>

      <div className="flex flex-col gap-[20px]">
        <div className="flex gap-[7px]">
          <h1 className="firaGO-font text-[500] text-[20px] text-[#000000]">
            კომენტარები
          </h1>
          <p className="flex items-center justify-center w-[30px] h-[22px] rounded-[30px] bg-[#8338EC] firaGO-font text-[500] text-[14px] text-[#FFFFFF]">
            {comments.length}
          </p>
        </div>

        <div className="flex flex-col gap-[20px] h-[500px] max-h-[500px] overflow-y-auto">
          {isLoading && comments.length === 0 ? (
            <p className="firaGO-font text-[14px] text-center">
              იტვირთება კომენტარები...
            </p>
          ) : comments.length === 0 ? (
            <p className="firaGO-font text-[14px] text-center">
              კომენტარები არ არის
            </p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex flex-col gap-[15px]">
                <div className="w-full  w-[600px]">
                  <div className="flex gap-[12px] ">
                    <img
                      src={comment.user.avatar}
                      alt={comment.user.name}
                      className="w-[30px] h-[30px] rounded-full"
                    />
                    <div className="flex flex-col gap-[10px]">
                      <div className="flex flex-col gap-[7px]">
                        <p className="firaGO-font text-[500] text-[18px] text-[#212529] leading-[0px] ">
                          {comment.user.name}
                        </p>
                        <p className="firaGO-font text-[350] text-[16px] text-[#343A40] ">
                          {comment.text}
                        </p>
                      </div>

                      {!comment.parent_id && (
                        <div className="flex gap-[6px]">
                          <img src={left} alt="left" />
                          <button
                            type="button"
                            className="firaGO-font text-[400] text-[12px] text-[#8338EC] leading-[0px]  cursor-pointer"
                            onClick={() =>
                              setReplyToId(
                                replyToId === comment.id ? null : comment.id
                              )
                            }
                          >
                            {replyToId === comment.id ? "გაუქმება" : "უპასუხე"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {replyToId === comment.id && (
                  <form
                    className="w-[90%] ml-auto h-[104px] bg-[#FFFFFF] flex flex-col justify-between border-[0.3px] border-[#ADB5BD] pt-[18px] pb-[15px] px-[20px] rounded-[10px]"
                    onSubmit={(e) => handleReplySubmit(e, comment.id)}
                  >
                    <textarea
                      placeholder="დაწერე პასუხი"
                      className="firaGO-font text-[350] text-[14px] text-[#898989] border-none resize-none outline-none"
                      aria-label="Reply input"
                      value={replyText}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        setReplyText(e.target.value)
                      }
                    ></textarea>
                    <button
                      type="submit"
                      className={`w-[155px] h-[35px] self-end items-center justify-center firaGO-font text-[400] text-[16px] text-[#FFFFFF] rounded-[20px] ${
                        replyText.trim()
                          ? "bg-[#8338EC] cursor-pointer"
                          : "bg-[#8338ECA6] cursor-not-allowed"
                      }`}
                      disabled={!replyText.trim() || isLoading}
                    >
                      უპასუხე
                    </button>
                  </form>
                )}

                {comment.replies && comment.replies.length > 0 && (
                  <div className="ml-[30px] flex flex-col gap-[10px]">
                    {comment.replies.map((reply) => (
                      <div
                        key={reply.id}
                        className=""
                      >
                        <div className="flex justify-between items-center mb-[10px] ">
                          <div className="flex items-start gap-[10px]">
                            {reply.user.avatar ? (
                              <img
                                src={reply.user.avatar}
                                alt={reply.user.name}
                                className="w-[30px] h-[30px] rounded-full"
                              />
                            ) : (
                              <div className="w-[30px] h-[30px] rounded-full bg-[#8338EC] flex items-center justify-center text-white">
                                {reply.user.name.charAt(0)}
                              </div>
                            )}
                            <div className="flex flex-col gap-[7px]">
                            <span className="firaGO-font text-[500] text-[18px] text-[#212529]">
                              {reply.user.name}
                            </span>
                            <p className="firaGO-font text-[350] text-[16px] text-[#343A40] ">{reply.text}</p>

                            </div>
                           
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Comments;
